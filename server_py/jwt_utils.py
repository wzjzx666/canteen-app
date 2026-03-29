import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional

from server_py.settings import TOKEN_EXPIRES_IN, JWT_SECRET


def _base64url_encode(raw: bytes) -> str:
  return (
    base64.urlsafe_b64encode(raw).decode('utf-8').rstrip('=').replace('+', '-').replace('/', '_')
  )


def _base64url_decode(raw: str) -> bytes:
  padded = raw + '=' * ((4 - len(raw) % 4) % 4)
  return base64.urlsafe_b64decode(padded.encode('utf-8'))


def _parse_expiry(expires_in: str) -> int:
  if not expires_in:
    return 8 * 3600
  if isinstance(expires_in, (int, float)) and expires_in > 0:
    return int(expires_in)
  s = str(expires_in).strip()
  # 支持: 10s / 8h / 3d
  import re

  m = re.match(r'^(\d+)([smhd])$', s, re.IGNORECASE)
  if not m:
    return 8 * 3600
  v = int(m.group(1))
  unit = m.group(2).lower()
  mult = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}.get(unit, 3600)
  return v * mult


def sign_token(payload: Dict[str, Any], expires_in: Optional[str] = None) -> str:
  expires_in = expires_in or TOKEN_EXPIRES_IN
  header = {'alg': 'HS256', 'typ': 'JWT'}
  timestamp = int(time.time())
  expiry = timestamp + _parse_expiry(expires_in)

  header_b64 = _base64url_encode(json.dumps(header).encode('utf-8'))
  body = dict(payload)
  body['iat'] = timestamp
  body['exp'] = expiry
  body_b64 = _base64url_encode(json.dumps(body).encode('utf-8'))

  data = f'{header_b64}.{body_b64}'
  signature = hmac.new(JWT_SECRET.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).digest()
  sig_b64 = _base64url_encode(signature)
  return f'{data}.{sig_b64}'


def verify_token(raw_token: str) -> Dict[str, Any]:
  if not raw_token:
    raise ValueError('未提供 token')
  parts = raw_token.strip().split('.')
  if len(parts) != 3:
    raise ValueError('Token 格式不正确')
  header_b64, payload_b64, signature = parts

  data = f'{header_b64}.{payload_b64}'
  verified_sig = hmac.new(JWT_SECRET.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).digest()
  verified_sig_b64 = _base64url_encode(verified_sig)
  if verified_sig_b64 != signature:
    raise ValueError('Token 签名校验失败')

  payload = json.loads(_base64url_decode(payload_b64).decode('utf-8'))
  now = int(time.time())
  exp = payload.get('exp')
  if exp and now > int(exp):
    raise ValueError('Token 已过期')
  return payload

