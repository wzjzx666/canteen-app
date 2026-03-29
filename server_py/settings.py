import os

from dotenv import load_dotenv

# Ensure we load the same env file your Node backend uses
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'server', 'server.env'))


def get_env(name: str, default: str):
  value = os.getenv(name)
  return value if value is not None and value != '' else default


DB_HOST = get_env('DB_HOST', 'localhost')
DB_USER = get_env('DB_USER', 'root')
DB_PASSWORD = get_env('DB_PASSWORD', '')
DB_NAME = get_env('DB_NAME', 'smart_canteen')

JWT_SECRET = get_env('JWT_SECRET', 'smart_conteen_secret')
TOKEN_EXPIRES_IN = get_env('TOKEN_EXPIRES_IN', '8h')

PORT = int(get_env('PORT', '3001'))

# 允许跨域（本地开发常用）
CORS_ALLOW_ORIGINS = get_env('CORS_ALLOW_ORIGINS', '*')

