require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // 从环境变量读取密码
    database: 'smart_conteen',
    waitForConnections: true,
    connectionLimit: 10,
});

// 示例 API：获取食堂数据
app.get('/api/canteens', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM canteens');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${ PORT }`);
});
