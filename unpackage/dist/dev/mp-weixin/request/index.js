"use strict";
const common_vendor = require("../common/vendor.js");
const request_common = require("./common.js");
const BASE_URL = request_common.common.getBaseUrl();
const getToken = () => common_vendor.index.getStorageSync("token") || "";
const request = ({ method, url, data, token }) => new Promise((resolve, reject) => {
  const headers = { "content-type": "application/json" };
  if (token)
    headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  common_vendor.index.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: headers,
    success: (res) => resolve(res.data),
    fail: (err) => reject(err)
  });
});
const buildQuery = (url, params = {}) => {
  const keys = Object.keys(params).filter((k) => params[k] !== void 0 && params[k] !== null);
  if (!keys.length)
    return url;
  return `${url}?${keys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&")}`;
};
const get = (url, { params, token } = {}) => request({ method: "GET", url: buildQuery(url, params), token });
const post = (url, data, { token } = {}) => request({ method: "POST", url, data, token });
const put = (url, data, { token } = {}) => request({ method: "PUT", url, data, token });
const del = (url, data, { token } = {}) => request({ method: "DELETE", url, data, token });
const login = (data) => post("/api/auth/login", data);
const register = (data) => post("/api/auth/register", data);
const getProfile = () => get("/api/auth/profile", { token: getToken() });
const getCanteens = () => get("/api/canteens");
const getCanteenById = (id) => get(`/api/canteens/${id}`);
const createCanteen = (data) => post("/api/canteens", data, { token: getToken() });
const updateCanteen = (id, data) => put(`/api/canteens/${id}`, data, { token: getToken() });
const deleteCanteen = (id) => del(`/api/canteens/${id}`, {}, { token: getToken() });
const getCategories = (params) => get("/api/categories", { params });
const getCategoryById = (id) => get(`/api/categories/${id}`);
const createCategory = (data) => post("/api/categories", data, { token: getToken() });
const updateCategory = (id, data) => put(`/api/categories/${id}`, data, { token: getToken() });
const deleteCategory = (id) => del(`/api/categories/${id}`, {}, { token: getToken() });
const getDishes = (params) => get("/api/dishes", { params });
const getDishById = (id) => get(`/api/dishes/${id}`);
const createDish = (data) => post("/api/dishes", data, { token: getToken() });
const updateDish = (id, data) => put(`/api/dishes/${id}`, data, { token: getToken() });
const deleteDish = (id) => del(`/api/dishes/${id}`, {}, { token: getToken() });
const getOrders = (params) => get("/api/orders", { params, token: getToken() });
const getOrderById = (id) => get(`/api/orders/${id}`, { token: getToken() });
const createOrder = (data) => post("/api/orders", data, { token: getToken() });
const updateOrder = (id, data) => put(`/api/orders/${id}`, data, { token: getToken() });
const deleteOrder = (id) => del(`/api/orders/${id}`, {}, { token: getToken() });
const getOrderItems = () => get("/api/order-items", { token: getToken() });
const getOrderItemById = (id) => get(`/api/order-items/${id}`, { token: getToken() });
const createOrderItem = (data) => post("/api/order-items", data, { token: getToken() });
const getUsers = () => get("/api/users", { token: getToken() });
const getUserById = (id) => get(`/api/users/${id}`, { token: getToken() });
const createUser = (data) => post("/api/users", data, { token: getToken() });
const updateUser = (id, data) => put(`/api/users/${id}`, data, { token: getToken() });
const deleteUser = (id) => del(`/api/users/${id}`, {}, { token: getToken() });
const api = {
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
  deleteUser
};
exports.api = api;
exports.getProfile = getProfile;
