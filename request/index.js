import { common } from './common.js';

const BASE_URL = common.getBaseUrl();
const getToken = () => uni.getStorageSync('token') || '';

// ==================== 请求封装 ====================

const request = ({ method, url, data, token }) =>
  new Promise((resolve, reject) => {
    const headers = { 'content-type': 'application/json' };
    if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: headers,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err),
    });
  });

const buildQuery = (url, params = {}) => {
  const keys = Object.keys(params).filter((k) => params[k] !== undefined && params[k] !== null);
  if (!keys.length) return url;
  return `${url}?${keys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
};

const get = (url, { params, token } = {}) => request({ method: 'GET', url: buildQuery(url, params), token });
const post = (url, data, { token } = {}) => request({ method: 'POST', url, data, token });
const put = (url, data, { token } = {}) => request({ method: 'PUT', url, data, token });
const del = (url, { params, token } = {}) => request({ method: 'DELETE', url: buildQuery(url, params), token });

// ==================== 认证 ====================

export const login = (data) => post('/api/auth/login', data);
export const register = (data) => post('/api/auth/register', data);
export const getProfile = () => get('/api/auth/profile', { token: getToken() });

// ==================== 食堂 ====================

export const getCanteens = (params) => get('/api/canteens', { params });
export const getCanteensPage = (params) => get('/api/canteens/page', { params });
export const getCanteenById = (params) => get(`/api/canteens/${params.id}`);
export const createCanteen = (data) => post('/api/canteens', data, { token: getToken() });
export const updateCanteen = (data) => put(`/api/canteens/${data.id}`, data, { token: getToken() });
export const deleteCanteen = (params) => del(`/api/canteens/${params.id}`, { token: getToken() });

// ==================== 分类 ====================

export const getCategories = (params) => get('/api/categories', { params });
export const getCategoryById = (params) => get(`/api/categories/${params.id}`);
export const createCategory = (data) => post('/api/categories', data, { token: getToken() });
export const updateCategory = (data) => put(`/api/categories/${data.id}`, data, { token: getToken() });
export const deleteCategory = (params) => del(`/api/categories/${params.id}`, { token: getToken() });

// ==================== 菜品 ====================

export const getDishes = (params) => get('/api/dishes', { params });
export const getDishById = (params) => get(`/api/dishes/${params.id}`);
export const createDish = (data) => post('/api/dishes', data, { token: getToken() });
export const updateDish = (data) => put(`/api/dishes/${data.id}`, data, { token: getToken() });
export const deleteDish = (params) => del(`/api/dishes/${params.id}`, { token: getToken() });

// ==================== 订单 ====================

export const getOrders = (params) => get('/api/orders', { params, token: getToken() });
export const getOrderById = (params) => get(`/api/orders/${params.id}`, { token: getToken() });
export const createOrder = (data) => post('/api/orders', data, { token: getToken() });
export const updateOrder = (data) => put(`/api/orders/${data.id}`, data, { token: getToken() });
export const deleteOrder = (params) => del(`/api/orders/${params.id}`, { token: getToken() });

// ==================== 订单明细 ====================

export const getOrderItems = (params) => get('/api/order-items', { params, token: getToken() });
export const getOrderItemById = (params) => get(`/api/order-items/${params.id}`, { token: getToken() });
export const createOrderItem = (data) => post('/api/order-items', data, { token: getToken() });

// ==================== 用户（管理员） ====================

export const getUsers = (params) => get('/api/users', { params, token: getToken() });
export const getUserById = (params) => get(`/api/users/${params.id}`, { token: getToken() });
export const createUser = (data) => post('/api/users', data, { token: getToken() });
export const updateUser = (data) => put(`/api/users/${data.id}`, data, { token: getToken() });
export const deleteUser = (params) => del(`/api/users/${params.id}`, { token: getToken() });

// 默认导出，挂载到 app.config.globalProperties.$api
export default {
  login, register, getProfile,
  getCanteens, getCanteensPage, getCanteenById, createCanteen, updateCanteen, deleteCanteen,
  getCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
  getDishes, getDishById, createDish, updateDish, deleteDish,
  getOrders, getOrderById, createOrder, updateOrder, deleteOrder,
  getOrderItems, getOrderItemById, createOrderItem,
  getUsers, getUserById, createUser, updateUser, deleteUser,
};
