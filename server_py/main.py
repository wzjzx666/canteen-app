from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

import os

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from server_py.db import execute, get_many, get_one, schema_init, schema
from server_py.jwt_utils import sign_token, verify_token
from server_py.settings import CORS_ALLOW_ORIGINS, JWT_SECRET, DB_NAME

import hashlib
import random
import time
import bcrypt

# Load existing backend env (server/server.env)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'server', 'server.env'))

app = FastAPI(title='smart_conteen_py')

app.add_middleware(
  CORSMiddleware,
  allow_origins=[CORS_ALLOW_ORIGINS] if CORS_ALLOW_ORIGINS != '*' else ['*'],
  allow_credentials=CORS_ALLOW_ORIGINS != '*',
  allow_methods=['*'],
  allow_headers=['*'],
)


def md5_hash(value: str) -> str:
  return hashlib.md5(value.encode('utf-8')).hexdigest()


def _to_float(v: Any) -> Any:
  if v is None:
    return None
  try:
    return float(v)
  except Exception:
    return v


def _to_int(v: Any) -> Any:
  if v is None:
    return None
  try:
    return int(v)
  except Exception:
    return v


def _to_iso(v: Any) -> Any:
  if v is None:
    return None
  # datetime / date
  iso = getattr(v, 'isoformat', None)
  if callable(iso):
    return iso()
  return v


def extract_bearer_token(request: Request) -> str:
  auth = request.headers.get('authorization') or request.headers.get('Authorization') or ''
  auth = auth.strip()
  if auth.startswith('Bearer '):
    return auth[7:]
  return auth


def get_current_user(request: Request) -> Dict[str, Any]:
  token = extract_bearer_token(request)
  try:
    payload = verify_token(token)
    return payload
  except Exception as e:
    raise HTTPException(status_code=401, detail=str(e))


def _col(table: str, candidates: List[str]) -> Optional[str]:
  schema.load_table_columns(table)
  return schema.has_col(table, candidates)


def _table_exists(table: str) -> bool:
  schema.load_table_columns(table)
  return bool(schema.columns.get(table))


@app.on_event('startup')
def on_startup() -> None:
  schema_init()


@app.post('/api/auth/register')
def auth_register(body: Dict[str, Any]):
  raw_username = str(body.get('username') or '').strip()
  raw_password = str(body.get('password') or '').strip()
  role = str(body.get('role') or 'student').strip()

  if not raw_username or not raw_password:
    raise HTTPException(status_code=400, detail='用户名和密码不能为空')
  if len(raw_username) < 3 or len(raw_password) < 6:
    raise HTTPException(status_code=400, detail='用户名最少 3 位，密码最少 6 位')

  # 你的数据库 users.role enum: ('admin','staff','student')
  if role == 'teacher':
    role = 'staff'
  allowed_roles = ['admin', 'staff', 'student']
  if role and role not in allowed_roles:
    raise HTTPException(status_code=400, detail='角色不在允许列表内')

  exists = get_one('SELECT id FROM users WHERE username = %s LIMIT 1', (raw_username,))
  if exists:
    return {'code': 409, 'success': False, 'error': '用户名已存在'}

  # 你的数据库 users.password 是 bcrypt；salt 字段 NOT NULL
  salt_value = 'salted'
  password_hash = bcrypt.hashpw(
    raw_password.encode('utf-8'),
    bcrypt.gensalt(rounds=10),
  ).decode('utf-8')

  execute(
    'INSERT INTO users (username, password, salt, role, created_at, updated_at) VALUES (%s, %s, %s, %s, NOW(), NOW())',
    (raw_username, password_hash, salt_value, role),
  )
  return {'code': 201, 'success': True, 'data': {'id': None}, 'msg': '注册成功'}


@app.post('/api/auth/login')
def auth_login(body: Dict[str, Any]):
  raw_username = str(body.get('username') or '').strip()
  raw_password = str(body.get('password') or '').strip()

  if not raw_username or not raw_password:
    raise HTTPException(status_code=400, detail='用户名和密码不能为空')

  row = get_one('SELECT id, username, role, password FROM users WHERE username = %s LIMIT 1', (raw_username,))
  if not row:
    return {'code': 404, 'success': False, 'error': '用户不存在'}

  stored_hash = str(row.get('password') or '')
  if not stored_hash:
    return {'code': 401, 'success': False, 'error': '密码错误'}

  if not bcrypt.checkpw(raw_password.encode('utf-8'), stored_hash.encode('utf-8')):
    return {'code': 401, 'success': False, 'error': '密码错误'}

  token = sign_token({'userId': row.get('id'), 'username': row.get('username'), 'role': row.get('role')})

  return {'code': 200, 'success': True, 'data': {'token': f'Bearer {token}'}, 'msg': '登录成功'}


def serialize_user(row: Dict[str, Any]) -> Dict[str, Any]:
  # 兼容字段（不知道你表里有没有），尽量取到就返回
  balance = row.get('balance')
  if balance is None:
    balance = row.get('current_balance') or row.get('money')
  if balance is None:
    balance = 0
  return {
    'id': row.get('id'),
    'username': row.get('username'),
    'role': row.get('role'),
    'created_at': _to_iso(row.get('created_at')),
    'updated_at': _to_iso(row.get('updated_at')),
    'balance': _to_float(balance) if balance is not None else None,
    'studentId': row.get('student_id') or row.get('studentId'),
    'nickname': row.get('nickname'),
    'avatar': row.get('avatar'),
  }


@app.get('/api/auth/profile')
def auth_profile(user_payload: Dict[str, Any] = Depends(get_current_user)):
  user_id = user_payload.get('userId')
  if not user_id:
    raise HTTPException(status_code=401, detail='无效的 token')

  row = get_one('SELECT * FROM users WHERE id = %s LIMIT 1', (user_id,))
  if not row:
    return {'code': 404, 'success': False, 'error': '用户不存在'}
  return {'code': 200, 'success': True, 'data': serialize_user(row)}


def _extract_rating(description: Any) -> Optional[float]:
  if not description:
    return None
  import re

  # 匹配：rating:4.7 / rating=4.7 / Rating:4.7
  m = re.search(r'rating\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)', str(description), re.IGNORECASE)
  if not m:
    return None
  try:
    return float(m.group(1))
  except Exception:
    return None


def _extract_image(description: Any) -> str:
  if not description:
    return ''
  import re

  # 匹配：image:https://xxx / image=xxx
  m = re.search(r'image\s*[:=]\s*([^\s]+)', str(description), re.IGNORECASE)
  if not m:
    return ''
  return str(m.group(1)).strip()


def serialize_canteen(row: Dict[str, Any]) -> Dict[str, Any]:
  return {
    'id': row.get('id'),
    'name': row.get('name'),
    'location': row.get('location'),
    'description': row.get('description'),
    # 尝试从 description 里提取 rating（导入脚本写入类似：xxx | rating:4.7）
    'rating': _extract_rating(row.get('description')),
    # 数据库表没有 image_url 字段，图片信息写入 description 后再解析
    'image': _extract_image(row.get('description')),
  }


@app.get('/api/canteens')
def list_canteens():
  rows = get_many('SELECT * FROM canteens ORDER BY id DESC')
  return {'success': True, 'data': [serialize_canteen(r) for r in rows]}


@app.get('/api/canteens/{canteen_id}')
def get_canteen(canteen_id: int):
  row = get_one('SELECT * FROM canteens WHERE id = %s LIMIT 1', (canteen_id,))
  if not row:
    return {'success': False, 'error': '食堂不存在'}
  return {'success': True, 'data': serialize_canteen(row)}


# ---------------------------
# 下面是“尽量自动适配字段名”的业务接口骨架
# 需要后续根据你的真实字段名微调
# ---------------------------


def _choose_col(table: str, candidates: List[str]) -> Optional[str]:
  schema.load_table_columns(table)
  return schema.has_col(table, candidates)


def _dish_on_shelf_filter():
  # dishes 表：on_shelf/onShelf/is_on_shelf
  return _choose_col('dishes', ['on_shelf', 'onShelf', 'is_on_shelf'])


def get_dish_category_mapping() -> tuple[Dict[str, int], Dict[int, str]]:
  # 当前你的表结构：dishes.category + dishes.available，没有 categories 表
  rows = get_many('SELECT DISTINCT category FROM dishes')
  categories = sorted(
    [r.get('category') for r in rows if r.get('category') is not None and str(r.get('category')).strip() != ''],
    key=lambda x: str(x),
  )
  mapping: Dict[str, int] = {}
  rev: Dict[int, str] = {}
  for idx, cat in enumerate(categories, start=1):
    s = str(cat)
    mapping[s] = idx
    rev[idx] = s
  return mapping, rev


@app.get('/api/categories')
def list_categories(canteenId: Optional[int] = None):
  if canteenId is None:
    rows = get_many('SELECT id, name, canteen_id FROM categories ORDER BY canteen_id, id')
  else:
    rows = get_many(
      'SELECT id, name, canteen_id FROM categories WHERE canteen_id = %s ORDER BY id',
      (canteenId,),
    )
  return {
    'success': True,
    'data': [
      {'id': r.get('id'), 'name': r.get('name'), 'canteenId': r.get('canteen_id')}
      for r in rows
    ],
  }


@app.get('/api/dishes')
def list_dishes(canteenId: Optional[int] = None, categoryId: Optional[int] = None, all: Optional[bool] = False):
  available_col = _choose_col('dishes', ['available', 'on_shelf', 'onShelf', 'is_on_shelf'])
  stock_col = _choose_col('dishes', ['stock'])
  sales_col = _choose_col('dishes', ['sales'])

  where = []
  params: List[Any] = []

  join_sql = 'JOIN categories c ON d.category = c.name'

  if canteenId is not None:
    where.append('c.canteen_id = %s')
    params.append(canteenId)

  if categoryId is not None:
    where.append('c.id = %s')
    params.append(int(categoryId))

  if available_col and not all:
    where.append(f'd.{available_col} = 1')

  where_sql = ('WHERE ' + ' AND '.join(where)) if where else ''
  sql = f'''
    SELECT d.*, c.id AS categoryId
    FROM dishes d
    {join_sql}
    {where_sql}
    ORDER BY d.id
  '''
  rows = get_many(sql, tuple(params))

  def map_dish(r: Dict[str, Any]) -> Dict[str, Any]:
    on_shelf_bool = True
    if available_col:
      on_shelf_bool = r.get(available_col) in (1, True)
    stock = _to_int(r.get(stock_col)) if stock_col else 999
    sales = _to_int(r.get(sales_col)) if sales_col else 0
    return {
      'id': r.get('id'),
      'categoryId': r.get('categoryId'),
      'name': r.get('name'),
      'price': _to_float(r.get('price')),
      'stock': stock if on_shelf_bool else 0,
      'image': r.get('image_url') or r.get('image'),
      'sales': sales if on_shelf_bool else 0,
      'description': r.get('description'),
      'onShelf': on_shelf_bool,
    }

  return {'success': True, 'data': [map_dish(r) for r in rows]}


@app.get('/api/dishes/all')
def list_dishes_all():
  # 兜底到 list_dishes 的映射输出
  return list_dishes(all=True)


@app.get('/api/dishes/{dish_id}')
def get_dish(dish_id: int):
  row = get_one('SELECT * FROM dishes WHERE id = %s LIMIT 1', (dish_id,))
  if not row:
    return {'success': False, 'error': '菜品不存在'}
  available_col = _choose_col('dishes', ['available', 'on_shelf', 'onShelf', 'is_on_shelf'])
  stock_col = _choose_col('dishes', ['stock'])
  sales_col = _choose_col('dishes', ['sales'])
  cid_row = get_one('SELECT id FROM categories WHERE name = %s LIMIT 1', (row.get('category'),))
  cid = cid_row.get('id') if cid_row else None
  on_shelf_bool = row.get(available_col) in (1, True) if available_col else True
  stock = _to_int(row.get(stock_col)) if stock_col else 999
  sales = _to_int(row.get(sales_col)) if sales_col else 0
  return {
    'success': True,
    'data': {
      **row,
      'categoryId': cid,
      'onShelf': on_shelf_bool,
      'stock': stock if on_shelf_bool else 0,
      'sales': sales if on_shelf_bool else 0,
      'image': row.get('image_url') or row.get('image'),
      'image_url': row.get('image_url'),
    },
  }


# ---------------------------
# 订单、支付、充值（尽量适配常见字段名）
# ---------------------------


@app.get('/api/orders')
def list_orders(status: int = -1, payload: Dict[str, Any] = Depends(get_current_user)):
  if not _table_exists('orders'):
    raise HTTPException(status_code=501, detail='orders 表不存在')

  orders_user_col = _col('orders', ['user_id', 'userId'])
  orders_status_col = _col('orders', ['status'])
  orders_total_col = _col('orders', ['total_price', 'totalPrice', 'total'])
  orders_canteen_col = _col('orders', ['canteen_id', 'canteenId'])
  orders_create_time_col = _col('orders', ['create_time', 'created_at', 'createTime', 'createdTime', 'created_time'])
  orders_pickup_col = _col('orders', ['pickup_code', 'pickupCode'])
  orders_paid_col = _col('orders', ['paid', 'is_paid'])
  orders_pay_type_col = _col('orders', ['pay_type', 'payType', 'payment_type'])

  base_where = []
  params: List[Any] = []

  user_id = payload.get('userId')
  if orders_user_col and user_id is not None:
    base_where.append(f'o.{orders_user_col} = %s')
    params.append(user_id)

  if status is not None and status != -1 and orders_status_col:
    status_to_enum = {
      0: ['pending', 'paid'],
      1: ['completed'],
      2: ['canceled'],
    }
    enum_vals = status_to_enum.get(status, None)
    if enum_vals:
      placeholders = ','.join(['%s'] * len(enum_vals))
      base_where.append(f'o.{orders_status_col} IN ({placeholders})')
      params.extend(enum_vals)

  where_sql = ('WHERE ' + ' AND '.join(base_where)) if base_where else ''

  # canteen join：用于展示 canteen.name
  canteen_name_col = _col('canteens', ['name'])
  orders_canteen_sql = '1=1'
  if orders_canteen_col and canteen_name_col:
    orders_canteen_sql = f'c.id = o.{orders_canteen_col}'

  sql = f'''
    SELECT o.*, c.name AS canteen_name
    FROM orders o
    LEFT JOIN canteens c ON {orders_canteen_sql}
    {where_sql}
    ORDER BY o.id DESC
  '''
  rows = get_many(sql, tuple(params))

  # order_items
  items_rows: Dict[Any, List[Dict[str, Any]]] = {}
  if _table_exists('order_items'):
    item_order_col = _col('order_items', ['order_id', 'orderId'])
    item_dish_col = _col('order_items', ['dish_id', 'dishId'])
    item_count_col = _col('order_items', ['count', 'quantity', 'qty'])
    item_price_col = _col('order_items', ['price', 'unit_price', 'amount'])

    dish_name_col = _col('dishes', ['name'])
    dish_price_col = _col('dishes', ['price'])

    order_ids = [r.get('id') for r in rows if r.get('id') is not None]
    if order_ids and item_order_col and item_dish_col and item_count_col:
      placeholders = ','.join(['%s'] * len(order_ids))
      join_sql = ''
      select_name_price = ''
      if dish_name_col:
        select_name_price += ', d.name AS dish_name'
        join_sql = f'JOIN dishes d ON oi.{item_dish_col} = d.id'
      if dish_price_col and not item_price_col:
        select_name_price += ', d.{dish_price_col} AS item_price'

      sql_items = f'''
        SELECT oi.*, {dish_name_col and 'd.name AS dish_name' or 'NULL AS dish_name'} , 
               {item_price_col and f'oi.{item_price_col} AS item_price' or 'NULL AS item_price'}
        FROM order_items oi
        {dish_name_col and 'JOIN dishes d ON oi.' + item_dish_col + ' = d.id' or ''}
        WHERE oi.{item_order_col} IN ({placeholders})
      '''
      items = get_many(sql_items, tuple(order_ids))
      for it in items:
        oid = it.get('order_id') or it.get('orderId') or it.get(item_order_col)  # best effort
        items_rows.setdefault(oid, []).append(
          {
            'dishId': it.get(item_dish_col),
            'count': it.get(item_count_col) or it.get('count'),
            'price': it.get(item_price_col) if item_price_col else it.get('item_price'),
            'name': it.get('dish_name') or it.get('name'),
          },
        )

  data = []
  for r in rows:
    order_id = r.get('id')
    total = r.get(orders_total_col) if orders_total_col else r.get('totalPrice') or r.get('total_price')
    st = r.get(orders_status_col) if orders_status_col else r.get('status')
    if st in ('pending', 'paid'):
      numeric_status = 0
    elif st == 'completed':
      numeric_status = 1
    elif st == 'canceled':
      numeric_status = 2
    else:
      numeric_status = -1

    raw_items = items_rows.get(order_id, []) or []
    items = []
    for it in raw_items:
      items.append(
        {
          **it,
          'price': _to_float(it.get('price') or 0),
          'count': _to_int(it.get('count') or 0),
        },
      )
    data.append(
      {
        'id': order_id,
        'status': numeric_status,
        'totalPrice': _to_float(total) if total is not None else 0,
        'createTime': r.get(orders_create_time_col) if orders_create_time_col else None,
        'pickupCode': r.get(orders_pickup_col) if orders_pickup_col else None,
        'paid': r.get(orders_paid_col) if orders_paid_col else None,
        'payType': r.get(orders_pay_type_col) if orders_pay_type_col else None,
        'canteen': orders_canteen_col and {'name': r.get('canteen_name'), 'id': r.get(orders_canteen_col)} or {'name': r.get('canteen_name')},
        'items': items,
      },
    )

  return {'success': True, 'data': data}


@app.get('/api/orders/{order_id}')
def get_order(order_id: str, payload: Dict[str, Any] = Depends(get_current_user)):
  if not _table_exists('orders'):
    raise HTTPException(status_code=501, detail='orders 表不存在')

  row = get_one('SELECT * FROM orders WHERE id = %s LIMIT 1', (order_id,))
  if not row:
    return {'success': False, 'error': '订单不存在'}

  # 把 canteen、items 拼起来
  orders_canteen_col = _col('orders', ['canteen_id', 'canteenId'])
  canteen_row = None
  if orders_canteen_col:
    canteen_row = get_one('SELECT id, name, location, description FROM canteens WHERE id = %s LIMIT 1', (row.get(orders_canteen_col),))

  items = []
  if _table_exists('order_items'):
    item_order_col = _col('order_items', ['order_id', 'orderId'])
    item_dish_col = _col('order_items', ['dish_id', 'dishId'])
    item_count_col = _col('order_items', ['count', 'quantity', 'qty'])
    item_price_col = _col('order_items', ['price', 'unit_price', 'amount'])
    if item_order_col and item_dish_col and item_count_col:
      sql_items = f'''
        SELECT oi.*, d.name AS dish_name
        FROM order_items oi
        LEFT JOIN dishes d ON oi.{item_dish_col} = d.id
        WHERE oi.{item_order_col} = %s
      '''
      items_rows = get_many(sql_items, (order_id,))
      for it in items_rows:
        items.append(
          {
            'dishId': it.get(item_dish_col),
            'count': it.get(item_count_col),
            'price': it.get(item_price_col) if item_price_col else it.get('price'),
            'name': it.get('dish_name'),
          },
        )

  orders_status_col = _col('orders', ['status'])
  orders_total_col = _col('orders', ['total_price', 'totalPrice', 'total'])
  orders_create_time_col = _col('orders', ['create_time', 'created_at', 'createTime', 'createdTime', 'created_time'])
  orders_pickup_col = _col('orders', ['pickup_code', 'pickupCode'])
  orders_paid_col = _col('orders', ['paid', 'is_paid'])
  orders_pay_type_col = _col('orders', ['pay_type', 'payType', 'payment_type'])

  st = row.get(orders_status_col) if orders_status_col else row.get('status')
  if st in ('pending', 'paid'):
    numeric_status = 0
  elif st == 'completed':
    numeric_status = 1
  elif st == 'canceled':
    numeric_status = 2
  else:
    numeric_status = -1

  mapped_items = []
  for it in items:
    mapped_items.append(
      {
        **it,
        'price': _to_float(it.get('price') or 0),
        'count': _to_int(it.get('count') or 0),
      },
    )

  return {
    'success': True,
    'data': {
      'id': row.get('id'),
      'status': numeric_status,
      'items': mapped_items,
      'totalPrice': _to_float(row.get(orders_total_col)) if orders_total_col else _to_float(row.get('totalPrice') or 0),
      'canteen': canteen_row,
      'createTime': row.get(orders_create_time_col) if orders_create_time_col else None,
      'pickupCode': row.get(orders_pickup_col) if orders_pickup_col else None,
      'paid': row.get(orders_paid_col) if orders_paid_col else None,
      'payType': row.get(orders_pay_type_col) if orders_pay_type_col else None,
    },
  }


@app.post('/api/orders/{order_id}/cancel')
def cancel_order(order_id: str, payload: Dict[str, Any] = Depends(get_current_user)):
  if not _table_exists('orders'):
    raise HTTPException(status_code=501, detail='orders 表不存在')

  orders_status_col = _col('orders', ['status'])
  if not orders_status_col:
    raise HTTPException(status_code=501, detail='orders.status 字段不存在')

  # 约定：2=已取消（与你 mockData 一致）
  affected = execute(
    f'UPDATE orders SET {orders_status_col} = \"canceled\" WHERE id = %s',
    (order_id,),
  )
  return {'success': True, 'affected': affected}


@app.post('/api/orders/{order_id}/pay')
def pay_order(order_id: str, body: Dict[str, Any], payload: Dict[str, Any] = Depends(get_current_user)):
  if not _table_exists('orders'):
    raise HTTPException(status_code=501, detail='orders 表不存在')

  pay_type = body.get('payType') or body.get('paymentMethod') or body.get('pay_type')

  orders_paid_col = _col('orders', ['paid', 'is_paid'])
  orders_pay_type_col = _col('orders', ['pay_type', 'payType', 'payment_type'])
  orders_status_col = _col('orders', ['status'])

  sets = []
  params: List[Any] = []
  if orders_paid_col:
    sets.append(f'{orders_paid_col} = 1')
  if orders_pay_type_col and pay_type:
    sets.append(f'{orders_pay_type_col} = %s')
    params.append(pay_type)
  if orders_status_col:
    sets.append(f'{orders_status_col} = \"paid\"')

  if not sets:
    raise HTTPException(status_code=501, detail='orders 的支付字段不存在')

  sql = f'UPDATE orders SET {", ".join(sets)} WHERE id = %s'
  params.append(order_id)
  execute(sql, tuple(params))
  return {'success': True}


@app.post('/api/recharge')
def recharge(body: Dict[str, Any], payload: Dict[str, Any] = Depends(get_current_user)):
  if not _table_exists('users'):
    raise HTTPException(status_code=501, detail='users 表不存在')
  amount = float(body.get('amount') or 0)
  if amount <= 0:
    return {'success': False, 'message': '充值金额无效'}

  balance_col = _col('users', ['balance', 'current_balance', 'money'])
  if not balance_col:
    raise HTTPException(status_code=501, detail='users.balance 字段不存在')

  user_id = payload.get('userId')
  execute(f'UPDATE users SET {balance_col} = COALESCE({balance_col}, 0) + %s WHERE id = %s', (amount, user_id))
  row = get_one(f'SELECT {balance_col} AS balance FROM users WHERE id = %s LIMIT 1', (user_id,))
  return {'success': True, 'balance': float(row.get('balance') or 0)}

