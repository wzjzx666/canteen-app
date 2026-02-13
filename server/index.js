require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Blade-Auth'
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'smart_conteen';
const JWT_SECRET = process.env.JWT_SECRET || 'smart_conteen_secret';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRES_IN || '8h';
const ALLOWED_ROLES = ['admin', 'staff', 'student'];

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
};

const parseExpiry = (raw) => {
  if (!raw) {
    return 8 * 3600;
  }
  if (typeof raw === 'number' && raw > 0) {
    return raw;
  }
  const match = String(raw).trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 8 * 3600;
  }
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * (multipliers[unit] || 3600);
};

const signToken = (payload, expiresIn = TOKEN_EXPIRATION) => {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const timestamp = Math.floor(Date.now() / 1000);
  const expiry = timestamp + parseExpiry(expiresIn);
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: timestamp,
      exp: expiry,
    })
  );
  const data = `${header}.${body}`;
  const signature = base64UrlEncode(
    crypto.createHmac('sha256', JWT_SECRET).update(data).digest()
  );
  return `${data}.${signature}`;
};

const verifyToken = (rawToken) => {
  if (!rawToken) {
    throw new Error('未提供 token');
  }
  const token = rawToken.trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token 格式不正确');
  }
  const [header, payload, signature] = parts;
  const verifiedSignature = base64UrlEncode(
    crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest()
  );
  if (verifiedSignature !== signature) {
    throw new Error('Token 签名校验失败');
  }
  const data = JSON.parse(base64UrlDecode(payload));
  const now = Math.floor(Date.now() / 1000);
  if (data.exp && now > data.exp) {
    throw new Error('Token 已过期');
  }
  return data;
};

const hashPassword = (value) => crypto.createHash('md5').update(value).digest('hex');

const serializeUser = (row) => {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
};

const serializeCanteen = (row) => {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
};

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      success: false,
      error: '权限校验失败',
      details: error.message,
    });
  }
});

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: '需要管理员权限',
    });
  }
  next();
};

app.post(
  '/api/auth/register',
  asyncHandler(async (req, res) => {
    const rawUsername = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const rawPassword = typeof req.body.password === 'string' ? req.body.password.trim() : '';
    const role = req.body.role ? String(req.body.role).trim() : 'student';

    if (!rawUsername || !rawPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        error: '用户名和密码不能为空',
      });
    }
    if (rawUsername.length < 3 || rawPassword.length < 6) {
      return res.status(400).json({
        code: 400,
        success: false,
        error: '用户名最少 3 位，密码最少 6 位',
      });
    }
    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        code: 400,
        success: false,
        error: '角色不在允许列表内',
      });
    }

    const [exist] = await pool.query('SELECT id FROM users WHERE username = ?', [rawUsername]);
    if (exist.length) {
      return res.status(409).json({
        code: 409,
        success: false,
        error: '用户名已存在',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [rawUsername, hashPassword(rawPassword), role || 'student']
    );

    return res.status(201).json({
      code: 201,
      success: true,
      data: {
        id: result.insertId,
      },
      msg: '注册成功',
    });
  })
);

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    const rawUsername = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const rawPassword = typeof req.body.password === 'string' ? req.body.password.trim() : '';

    if (!rawUsername || !rawPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        error: '用户名和密码不能为空',
      });
    }

    const [rows] = await pool.query('SELECT id, username, role, password FROM users WHERE username = ?', [rawUsername]);
    if (!rows.length) {
      return res.status(404).json({
        code: 404,
        success: false,
        error: '用户不存在',
      });
    }
    const user = rows[0];
    if (user.password !== hashPassword(rawPassword)) {
      return res.status(401).json({
        code: 401,
        success: false,
        error: '密码错误',
      });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        token: `Bearer ${token}`,
      },
      msg: '登录成功',
    });
  })
);

app.get(
  '/api/auth/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM users WHERE id = ?', [req.user.userId]);
    if (!rows.length) {
      return res.status(404).json({
        code: 404,
        success: false,
        error: '用户不存在',
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      data: serializeUser(rows[0]),
    });
  })
);

app.get(
  '/api/users',
  requireAuth,
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const total = Number(countRows[0]?.total ?? 0);
    const [rows] = await pool.query(
      'SELECT id, username, role, created_at, updated_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    };

    return res.json({
      success: true,
      data: rows.map(serializeUser),
      pagination,
    });
  })
);

app.get(
  '/api/users/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: '无效的用户 ID',
      });
    }
    const [rows] = await pool.query('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?', [userId]);
    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }
    return res.json({
      success: true,
      data: serializeUser(rows[0]),
    });
  })
);

app.post(
  '/api/users',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rawUsername = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const rawPassword = typeof req.body.password === 'string' ? req.body.password.trim() : '';
    const role = req.body.role ? String(req.body.role).trim() : 'student';

    if (!rawUsername || !rawPassword) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码不能为空',
      });
    }
    if (rawUsername.length < 3 || rawPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: '用户名最少 3 位，密码最少 6 位',
      });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: '角色不在允许列表内',
      });
    }

    const [exist] = await pool.query('SELECT id FROM users WHERE username = ?', [rawUsername]);
    if (exist.length) {
      return res.status(409).json({
        success: false,
        error: '用户名已存在',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [rawUsername, hashPassword(rawPassword), role]
    );
    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        username: rawUsername,
        role,
      },
      message: '用户创建成功',
    });
  })
);

app.put(
  '/api/users/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: '无效的用户 ID',
      });
    }

    const updates = [];
    const params = [];

    if (req.body.username) {
      const username = String(req.body.username).trim();
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          error: '用户名最少 3 位',
        });
      }
      const [exist] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
      if (exist.length) {
        return res.status(409).json({
          success: false,
          error: '用户名已存在',
        });
      }
      updates.push('username = ?');
      params.push(username);
    }

    if (req.body.role) {
      const role = String(req.body.role).trim();
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          error: '角色不在允许列表内',
        });
      }
      updates.push('role = ?');
      params.push(role);
    }

    if (req.body.password) {
      const password = String(req.body.password).trim();
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: '密码最少 6 位',
        });
      }
      updates.push('password = ?');
      params.push(hashPassword(password));
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        error: '缺少可更新的字段',
      });
    }

    updates.push('updated_at = NOW()');
    const [result] = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...params, userId]);
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }
    return res.json({
      success: true,
      message: '用户更新成功',
    });
  })
);

app.delete(
  '/api/users/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: '无效的用户 ID',
      });
    }
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }
    return res.json({
      success: true,
      message: '用户删除成功',
    });
  })
);

app.get(
  '/api/canteens',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      'SELECT id, name, location, description, created_at, updated_at FROM canteens ORDER BY id DESC'
    );
    return res.json({
      success: true,
      data: rows.map(serializeCanteen),
    });
  })
);

app.get(
  '/api/canteens/:id',
  asyncHandler(async (req, res) => {
    const canteenId = Number(req.params.id);
    if (!canteenId) {
      return res.status(400).json({
        success: false,
        error: '无效的食堂 ID',
      });
    }
    const [rows] = await pool.query(
      'SELECT id, name, location, description, created_at, updated_at FROM canteens WHERE id = ?',
      [canteenId]
    );
    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: '食堂不存在',
      });
    }
    return res.json({
      success: true,
      data: serializeCanteen(rows[0]),
    });
  })
);

app.post(
  '/api/canteens',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        error: '缺少名称或位置',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO canteens (name, location, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, location, description]
    );
    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        location,
        description,
      },
      message: 'Canteen created',
    });
  })
);

app.put(
  '/api/canteens/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const canteenId = Number(req.params.id);
    if (!canteenId) {
      return res.status(400).json({
        success: false,
        error: '无效的食堂 ID',
      });
    }
    const updates = [];
    const params = [];
    if (req.body.name) {
      updates.push('name = ?');
      params.push(String(req.body.name).trim());
    }
    if (req.body.location) {
      updates.push('location = ?');
      params.push(String(req.body.location).trim());
    }
    if (req.body.description) {
      updates.push('description = ?');
      params.push(String(req.body.description).trim());
    }
    if (!updates.length) {
      return res.status(400).json({
        success: false,
        error: '缺少要更新的字段',
      });
    }
    updates.push('updated_at = NOW()');
    const [result] = await pool.query(`UPDATE canteens SET ${updates.join(', ')} WHERE id = ?`, [
      ...params,
      canteenId,
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        error: '食堂不存在',
      });
    }
    return res.json({
      success: true,
      message: 'Canteen updated successfully',
    });
  })
);

app.delete(
  '/api/canteens/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const canteenId = Number(req.params.id);
    if (!canteenId) {
      return res.status(400).json({
        success: false,
        error: '无效的食堂 ID',
      });
    }
    const [result] = await pool.query('DELETE FROM canteens WHERE id = ?', [canteenId]);
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        error: '食堂不存在',
      });
    }
    return res.json({
      success: true,
      message: 'Canteen deleted successfully',
    });
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({
    success: false,
    error: '服务器异常',
    details: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
