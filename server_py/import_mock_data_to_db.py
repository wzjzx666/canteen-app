import mysql.connector

import bcrypt
import random

from server_py.settings import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME


# 将前端 src/mock/data.js 的“模拟表数据”写入 MySQL
# 目标：让 /api/canteens、/api/categories、/api/dishes 能稳定展示 mock 数据
#
# 说明（与你当前库结构对齐）：
# 1) 你的库里可能缺少 categories 表，以及 dishes/users/orders 的部分字段；
#    本脚本会自动建表/加列，再把 mock 数据写入。
# 2) orders/order_items 有外键：导入前会先清空 orders/order_items。
# 3) users.password 是 bcrypt：脚本会按 bcrypt 生成密码哈希（默认密码：123456）。


def insert_mock_data():
  def table_exists(cur, table: str) -> bool:
    cur.execute(
      'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s LIMIT 1',
      (DB_NAME, table),
    )
    return cur.fetchone() is not None

  def column_exists(cur, table: str, column: str) -> bool:
    cur.execute(
      'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s LIMIT 1',
      (DB_NAME, table, column),
    )
    return cur.fetchone() is not None

  categories_by_id = {
    101: '热销',
    102: '盖浇饭',
    103: '面点',
    104: '汤类',
    105: '素食',
    201: '麻辣香锅',
    202: '小炒',
    203: '火锅',
    204: '川菜',
    301: '清真特色',
    302: '烧烤',
    303: '新疆风味',
    304: '西北风味',
    401: '西式快餐',
    402: '日韩料理',
    403: '甜品饮品',
    404: '东南亚菜',
    405: '轻食沙拉',
  }

  canteens = [
    {
      'id': 1,
      'name': '北苑食堂',
      'location': '北区教学楼旁',
      'rating': 4.7,
      'image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=1200&q=60',
    },
    {
      'id': 2,
      'name': '南苑食堂',
      'location': '图书馆对面',
      'rating': 4.6,
      'image': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=1200&q=60',
    },
    {
      'id': 3,
      'name': '东苑清真餐厅',
      'location': '体育馆东侧',
      'rating': 4.8,
      'image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=1200&q=60',
    },
    {
      'id': 4,
      'name': '西苑美食广场',
      'location': '学生公寓西侧',
      'rating': 4.5,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=1200&q=60',
    },
  ]

  dishes = [
    {
      'id': 1001,
      'categoryId': 101,
      'name': '红烧肉盖饭',
      'price': 18.5,
      'stock': 36,
      'image': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'sales': 320,
      'description': '五花肉慢炖入味，搭配时蔬与米饭。',
      'onShelf': True,
    },
    {
      'id': 1002,
      'categoryId': 101,
      'name': '番茄牛腩饭',
      'price': 19.8,
      'stock': 28,
      'image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
      'sales': 280,
      'description': '番茄熬制，牛腩软烂多汁。',
      'onShelf': True,
    },
    {
      'id': 1003,
      'categoryId': 102,
      'name': '咖喱鸡块饭',
      'price': 16.8,
      'stock': 45,
      'image': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&w=800&q=60',
      'sales': 260,
      'description': '椰香咖喱，微辣开胃。',
      'onShelf': True,
    },
    {
      'id': 1004,
      'categoryId': 103,
      'name': '牛肉刀削面',
      'price': 15.0,
      'stock': 52,
      'image': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&w=800&q=60',
      'sales': 190,
      'description': '劲道刀削面，浓郁牛肉汤底。',
      'onShelf': True,
    },
    {
      'id': 1005,
      'categoryId': 102,
      'name': '红烧排骨饭',
      'price': 20.0,
      'stock': 30,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 150,
      'description': '精选猪排红烧至入味，肉质鲜嫩，搭配白米饭。',
      'onShelf': True,
    },
    {
      'id': 1006,
      'categoryId': 104,
      'name': '紫菜蛋花汤',
      'price': 8.0,
      'stock': 50,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 220,
      'description': '清淡鲜美，紫菜富含营养，是经典的汤品。',
      'onShelf': True,
    },
    {
      'id': 1007,
      'categoryId': 105,
      'name': '香菇青菜',
      'price': 10.0,
      'stock': 35,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 130,
      'description': '新鲜香菇搭配时令青菜，健康营养的素食选择。',
      'onShelf': True,
    },
    {
      'id': 2001,
      'categoryId': 201,
      'name': '经典麻辣香锅',
      'price': 24.5,
      'stock': 40,
      'image': 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'sales': 410,
      'description': '麻中带辣，荤素搭配，香气扑鼻。',
      'onShelf': True,
    },
    {
      'id': 2002,
      'categoryId': 202,
      'name': '小炒黄牛肉',
      'price': 22.0,
      'stock': 30,
      'image': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&w=800&q=60',
      'sales': 220,
      'description': '现炒现做，香辣爽口。',
      'onShelf': False,
    },
    {
      'id': 2003,
      'categoryId': 203,
      'name': '麻辣火锅',
      'price': 38.0,
      'stock': 20,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 95,
      'description': '正宗川味火锅，麻辣鲜香，配菜丰富。',
      'onShelf': True,
    },
    {
      'id': 2004,
      'categoryId': 204,
      'name': '口水鸡',
      'price': 18.0,
      'stock': 25,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 145,
      'description': '经典川菜，鸡肉嫩滑，麻辣中带甜。',
      'onShelf': True,
    },
    {
      'id': 3001,
      'categoryId': 301,
      'name': '清真牛肉抓饭',
      'price': 25.0,
      'stock': 34,
      'image': 'https://qcloud.dpfile.com/pc/9ra4bF5NkCm5F2NcDPHoHwSRzALUWXpLi6fO30jxyVKetTJPCukyTGns-vo8-MYZ.jpg',
      'sales': 150,
      'description': '新疆风味抓饭，颗粒分明，肉香十足。',
      'onShelf': True,
    },
    {
      'id': 3002,
      'categoryId': 302,
      'name': '孜然羊肉串',
      'price': 5.0,
      'stock': 120,
      'image': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&w=800&q=60',
      'sales': 500,
      'description': '炭火直烤，孜然飘香，外焦里嫩。',
      'onShelf': True,
    },
    {
      'id': 3003,
      'categoryId': 303,
      'name': '手抓羊肉',
      'price': 32.0,
      'stock': 20,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 110,
      'description': '精选宁夏滩羊，肉质鲜嫩无膻味，传统手抓做法。',
      'onShelf': True,
    },
    {
      'id': 3004,
      'categoryId': 304,
      'name': '兰州牛肉面',
      'price': 12.0,
      'stock': 45,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 200,
      'description': '一清二白三红四绿五黄，正宗兰州风味。',
      'onShelf': True,
    },
    {
      'id': 4001,
      'categoryId': 401,
      'name': '意大利肉酱面',
      'price': 22.0,
      'stock': 35,
      'image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
      'sales': 180,
      'description': '经典意式风味，手工面条配浓郁肉酱。',
      'onShelf': True,
    },
    {
      'id': 4002,
      'categoryId': 401,
      'name': '芝士汉堡套餐',
      'price': 28.0,
      'stock': 42,
      'image': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=800&q=60',
      'sales': 210,
      'description': '双层牛肉饼，配上新鲜蔬菜和芝士。',
      'onShelf': True,
    },
    {
      'id': 4003,
      'categoryId': 402,
      'name': '寿司拼盘',
      'price': 35.0,
      'stock': 25,
      'image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=800&q=60',
      'sales': 120,
      'description': '精选新鲜食材制作，包含三文鱼、金枪鱼等。',
      'onShelf': True,
    },
    {
      'id': 4004,
      'categoryId': 403,
      'name': '芒果冰沙',
      'price': 12.0,
      'stock': 60,
      'image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
      'sales': 95,
      'description': '新鲜芒果制成，清凉解暑。',
      'onShelf': True,
    },
    {
      'id': 4005,
      'categoryId': 404,
      'name': '泰式冬阴功汤',
      'price': 28.0,
      'stock': 15,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 85,
      'description': '正宗泰式风味，酸辣开胃，海鲜丰富。',
      'onShelf': True,
    },
    {
      'id': 4006,
      'categoryId': 405,
      'name': '凯撒沙拉',
      'price': 22.0,
      'stock': 30,
      'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
      'sales': 105,
      'description': '新鲜罗马生菜，搭配烤面包丁和帕玛森芝士。',
      'onShelf': True,
    },
  ]

  mock_users = [
    {
      'username': '20230001',
      'role': 'student',
      'student_id': '20230001',
      'nickname': '李同学',
      'avatar': 'https://images.unsplash.com/photo-1502720705749-3c9255857623?auto=format&w=400&q=60',
      'balance': 128.5,
    },
    {
      'username': '20231001',
      'role': 'staff',
      'student_id': '20231001',
      'nickname': '王老师',
      'avatar': 'https://images.unsplash.com/photo-1502720705749-3c9255857623?auto=format&w=400&q=60',
      'balance': 256.0,
    },
    {
      'username': 'ADM001',
      'role': 'admin',
      'student_id': 'ADM001',
      'nickname': '张管理员',
      'avatar': 'https://images.unsplash.com/photo-1502720705749-3c9255857623?auto=format&w=400&q=60',
      'balance': 0,
    },
  ]

  # 注意：orders/status 是 mock 里 0/1/2；导入时映射成数据库 enum：pending/completed/canceled
  mock_orders = [
    {
      'code': 'ORD-202401',
      'status': 0,
      'canteenId': 1,
      'totalPrice': 48.5,
      'items': [
        {'dishId': 1001, 'count': 1, 'price': 18.5},
        {'dishId': 1004, 'count': 2, 'price': 15.0},
      ],
    },
    {
      'code': 'ORD-202402',
      'status': 1,
      'canteenId': 2,
      'totalPrice': 24.5,
      'items': [{'dishId': 2001, 'count': 1, 'price': 24.5}],
    },
    {
      'code': 'ORD-202403',
      'status': 2,
      'canteenId': 3,
      'totalPrice': 50.0,
      'items': [{'dishId': 3001, 'count': 2, 'price': 25.0}],
    },
    {
      'code': 'ORD-202404',
      'status': 0,
      'canteenId': 4,
      'totalPrice': 52.0,
      'items': [
        {'dishId': 4002, 'count': 1, 'price': 28.0},
        {'dishId': 4004, 'count': 2, 'price': 12.0},
      ],
    },
  ]

  # categories 的 canteen_id 映射：按 mock categoryId 的百位推断（101->1, 201->2 ...）
  mock_categories = [
    {'id': cid, 'name': name, 'canteen_id': cid // 100}
    for cid, name in categories_by_id.items()
  ]

  default_password = '123456'
  salt_value = 'salted'
  password_hash = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt(rounds=10)).decode('utf-8')

  conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
  )
  cur = conn.cursor()

  try:
    # -----------------------------
    # 1) 建表/加列（如果缺失）
    # -----------------------------
    if not table_exists(cur, 'categories'):
      cur.execute(
        '''
        CREATE TABLE categories (
          id INT NOT NULL PRIMARY KEY,
          canteen_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_canteen_id (canteen_id),
          CONSTRAINT fk_categories_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        '''
      )

    if not column_exists(cur, 'dishes', 'stock'):
      cur.execute('ALTER TABLE dishes ADD COLUMN stock INT NOT NULL DEFAULT 0')
    if not column_exists(cur, 'dishes', 'sales'):
      cur.execute('ALTER TABLE dishes ADD COLUMN sales INT NOT NULL DEFAULT 0')

    # users 扩展字段：为了展示余额/昵称/头像
    if not column_exists(cur, 'users', 'balance'):
      cur.execute('ALTER TABLE users ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0')
    if not column_exists(cur, 'users', 'nickname'):
      cur.execute('ALTER TABLE users ADD COLUMN nickname VARCHAR(255) NULL')
    if not column_exists(cur, 'users', 'avatar'):
      cur.execute('ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL')
    if not column_exists(cur, 'users', 'student_id'):
      cur.execute('ALTER TABLE users ADD COLUMN student_id VARCHAR(50) NULL')

    # orders 扩展字段：前端展示用（取餐码、支付方式等）
    if not column_exists(cur, 'orders', 'canteen_id'):
      cur.execute('ALTER TABLE orders ADD COLUMN canteen_id INT NULL')
    if not column_exists(cur, 'orders', 'pickup_code'):
      cur.execute('ALTER TABLE orders ADD COLUMN pickup_code VARCHAR(50) NULL')
    if not column_exists(cur, 'orders', 'pay_type'):
      cur.execute('ALTER TABLE orders ADD COLUMN pay_type VARCHAR(50) NULL')
    if not column_exists(cur, 'orders', 'paid'):
      cur.execute('ALTER TABLE orders ADD COLUMN paid TINYINT(1) NOT NULL DEFAULT 0')

    conn.commit()

    # -----------------------------
    # 先清空 orders/order_items，避免外键约束影响 dishes/canteens 重写
    cur.execute('DELETE FROM order_items')
    cur.execute('DELETE FROM orders')

    # 清空 categories/canteens/dishes
    if table_exists(cur, 'categories'):
      cur.execute('DELETE FROM categories')

    cur.execute('DELETE FROM dishes')
    cur.execute('DELETE FROM canteens')

    # -----------------------------
    # 2) 写入 canteens / dishes / categories
    # -----------------------------
    canteen_sql = '''
      INSERT INTO canteens (id, name, location, description, created_at, updated_at)
      VALUES (%s, %s, %s, %s, NOW(), NOW())
    '''
    for c in canteens:
      # 用 description 承载额外字段，便于不改表结构情况下给前端返回 image/rating
      description = f"{c['location']} | rating:{c['rating']} | image:{c['image']}"
      cur.execute(
        canteen_sql,
        (c['id'], c['name'], c['location'], description),
      )

    # dishes 增加 stock/sales 后需要带入
    dish_sql = '''
      INSERT INTO dishes (
        id, name, description, price, image_url, available, category, stock, sales, created_at, updated_at
      )
      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    '''
    for d in dishes:
      category_name = categories_by_id.get(int(d['categoryId']))
      if not category_name:
        continue
      available = 1 if d['onShelf'] else 0
      cur.execute(
        dish_sql,
        (
          d['id'],
          d['name'],
          d['description'],
          d['price'],
          d['image'],
          available,
          category_name,
          int(d.get('stock', 0)),
          int(d.get('sales', 0)),
        ),
      )

    category_sql = '''
      INSERT INTO categories (id, canteen_id, name, created_at, updated_at)
      VALUES (%s, %s, %s, NOW(), NOW())
    '''
    for cat in mock_categories:
      cur.execute(
        category_sql,
        (cat['id'], cat['canteen_id'], cat['name']),
      )

    # -----------------------------
    # 3) 写入 users（upsert）
    # -----------------------------
    user_sql = '''
      INSERT INTO users (username, password, salt, role, balance, nickname, avatar, student_id, created_at, updated_at)
      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        password = VALUES(password),
        salt = VALUES(salt),
        role = VALUES(role),
        balance = VALUES(balance),
        nickname = VALUES(nickname),
        avatar = VALUES(avatar),
        student_id = VALUES(student_id),
        updated_at = NOW()
    '''
    for u in mock_users:
      cur.execute(
        user_sql,
        (
          u['username'],
          password_hash,
          salt_value,
          u['role'],
          u['balance'],
          u['nickname'],
          u['avatar'],
          u['student_id'],
        ),
      )

    # 获取学生用户 user_id，用于导入 mock orders
    cur.execute('SELECT id FROM users WHERE username = %s LIMIT 1', ('20230001',))
    row = cur.fetchone()
    user_id = row[0] if row else 1

    # -----------------------------
    # 4) 写入 orders / order_items
    # -----------------------------
    orders_sql = '''
      INSERT INTO orders (user_id, total_price, status, canteen_id, pickup_code, pay_type, paid, created_at)
      VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
    '''

    order_items_sql = '''
      INSERT INTO order_items (order_id, dish_id, quantity, unit_price)
      VALUES (%s, %s, %s, %s)
    '''

    status_map = {0: 'pending', 1: 'completed', 2: 'canceled'}
    for o in mock_orders:
      status_str = status_map.get(int(o['status']), 'pending')
      paid_flag = 0 if int(o['status']) == 2 else 1
      pickup_code = str(random.randint(100000, 999999))
      pay_type = '校园卡'

      cur.execute(
        orders_sql,
        (
          user_id,
          o['totalPrice'],
          status_str,
          int(o['canteenId']),
          pickup_code,
          pay_type,
          paid_flag,
        ),
      )
      order_id = cur.lastrowid

      for it in o['items']:
        cur.execute(
          order_items_sql,
          (
            order_id,
            int(it['dishId']),
            int(it['count']),
            it['price'],
          ),
        )

    conn.commit()
    print('Import mock data done')
    print('canteens:', len(canteens), 'dishes:', len(dishes))
    print('categories:', len(mock_categories), 'users:', len(mock_users), 'orders:', len(mock_orders))
  finally:
    cur.close()
    conn.close()


if __name__ == '__main__':
  insert_mock_data()

