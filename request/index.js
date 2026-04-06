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
const del = (url, data, { token } = {}) => request({ method: 'DELETE', url, data, token });

// ==================== 认证 ====================

// 登录
export const login = (data) => post('/api/auth/login', data);

// 注册
export const register = (data) => post('/api/auth/register', data);

// 获取当前用户信息
export const getProfile = () => get('/api/auth/profile', { token: getToken() });

// ==================== 食堂 ====================

// 获取食堂列表
export const getCanteens = () => get('/api/canteens');

// 根据 ID 获取食堂
export const getCanteenById = (id) => get(`/api/canteens/${id}`);

// 新增食堂（管理员）
export const createCanteen = (data) => post('/api/canteens', data, { token: getToken() });

// 修改食堂（管理员）
export const updateCanteen = (id, data) => put(`/api/canteens/${id}`, data, { token: getToken() });

// 删除食堂（管理员）
export const deleteCanteen = (id) => del(`/api/canteens/${id}`, {}, { token: getToken() });

// ==================== 分类 ====================

// 获取分类列表（可按食堂筛选）
export const getCategories = (params) => get('/api/categories', { params });

// 根据 ID 获取分类
export const getCategoryById = (id) => get(`/api/categories/${id}`);

// 新增分类（管理员）
export const createCategory = (data) => post('/api/categories', data, { token: getToken() });

// 修改分类（管理员）
export const updateCategory = (id, data) => put(`/api/categories/${id}`, data, { token: getToken() });

// 删除分类（管理员）
export const deleteCategory = (id) => del(`/api/categories/${id}`, {}, { token: getToken() });

// ==================== 菜品 ====================

// 获取菜品列表（可按食堂/分类筛选）
export const getDishes = (params) => get('/api/dishes', { params });

// 根据 ID 获取菜品
export const getDishById = (id) => get(`/api/dishes/${id}`);

// 新增菜品（管理员）
export const createDish = (data) => post('/api/dishes', data, { token: getToken() });

// 修改菜品（管理员）
export const updateDish = (id, data) => put(`/api/dishes/${id}`, data, { token: getToken() });

// 删除菜品（管理员）
export const deleteDish = (id) => del(`/api/dishes/${id}`, {}, { token: getToken() });

// ==================== 订单 ====================

// 获取订单列表
export const getOrders = () => get('/api/orders', { token: getToken() });

// 根据 ID 获取订单
export const getOrderById = (id) => get(`/api/orders/${id}`, { token: getToken() });

// 新增订单
export const createOrder = (data) => post('/api/orders', data, { token: getToken() });

// 修改订单（如更新状态）
export const updateOrder = (id, data) => put(`/api/orders/${id}`, data, { token: getToken() });

// 删除订单
export const deleteOrder = (id) => del(`/api/orders/${id}`, {}, { token: getToken() });

// ==================== 订单明细 ====================

// 获取订单明细列表
export const getOrderItems = () => get('/api/order-items', { token: getToken() });

// 根据 ID 获取订单明细
export const getOrderItemById = (id) => get(`/api/order-items/${id}`, { token: getToken() });

// 新增订单明细
export const createOrderItem = (data) => post('/api/order-items', data, { token: getToken() });

// ==================== 用户（管理员） ====================

// 获取用户列表
export const getUsers = () => get('/api/users', { token: getToken() });

// 根据 ID 获取用户
export const getUserById = (id) => get(`/api/users/${id}`, { token: getToken() });

// 新增用户
export const createUser = (data) => post('/api/users', data, { token: getToken() });

// 修改用户
export const updateUser = (id, data) => put(`/api/users/${id}`, data, { token: getToken() });

// 删除用户
export const deleteUser = (id) => del(`/api/users/${id}`, {}, { token: getToken() });

// 默认导出，挂载到 app.config.globalProperties.$api
export default {
  // 认证
  login,
  register,
  getProfile,
  // 食堂
  getCanteens,
  getCanteenById,
  createCanteen,
  updateCanteen,
  deleteCanteen,
  // 分类
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // 菜品
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  // 订单
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  // 订单明细
  getOrderItems,
  getOrderItemById,
  createOrderItem,
  // 用户
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
