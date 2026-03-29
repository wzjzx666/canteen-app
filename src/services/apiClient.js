const DEFAULT_API_BASE = 'http://localhost:3001';

const getApiBase = () => {
  const v = uni.getStorageSync('api_base');
  return v || DEFAULT_API_BASE;
};

const normalizeData = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return data;
};

export const apiRequest = ({ method, url, data, token, timeout = 8000 }) =>
  new Promise((resolve, reject) => {
    const headers = {
      'content-type': 'application/json',
    };
    if (token) {
      headers.authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    uni.request({
      url: `${getApiBase()}${url}`,
      method,
      data,
      header: headers,
      timeout,
      success: (res) => {
        resolve(normalizeData(res.data));
      },
      fail: (err) => reject(err),
    });
  });

export const apiGet = (url, { params = {}, token } = {}) => {
  const keys = Object.keys(params).filter(
    (k) => params[k] !== undefined && params[k] !== null,
  );
  const query = keys.length
    ? `?${keys
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&')}`
    : '';
  return apiRequest({ method: 'GET', url: `${url}${query}`, token });
};

export const apiPost = (url, data, { token } = {}) =>
  apiRequest({ method: 'POST', url, data, token });

export const apiPut = (url, data, { token } = {}) =>
  apiRequest({ method: 'PUT', url, data, token });

export const apiDelete = (url, data, { token } = {}) =>
  apiRequest({ method: 'DELETE', url, data, token });

