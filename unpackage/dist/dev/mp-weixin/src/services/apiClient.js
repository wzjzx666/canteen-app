"use strict";
const common_vendor = require("../../common/vendor.js");
const DEFAULT_API_BASE = "http://localhost:8080";
const getApiBase = () => {
  const v = common_vendor.index.getStorageSync("api_base");
  return v || DEFAULT_API_BASE;
};
const normalizeData = (data) => {
  if (!data)
    return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return data;
};
const apiRequest = ({ method, url, data, token, timeout = 8e3 }) => new Promise((resolve, reject) => {
  const headers = {
    "content-type": "application/json"
  };
  if (token) {
    headers.authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  common_vendor.index.request({
    url: `${getApiBase()}${url}`,
    method,
    data,
    header: headers,
    timeout,
    success: (res) => {
      resolve(normalizeData(res.data));
    },
    fail: (err) => reject(err)
  });
});
const apiGet = (url, { params = {}, token } = {}) => {
  const keys = Object.keys(params).filter(
    (k) => params[k] !== void 0 && params[k] !== null
  );
  const query = keys.length ? `?${keys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&")}` : "";
  return apiRequest({ method: "GET", url: `${url}${query}`, token });
};
const apiPost = (url, data, { token } = {}) => apiRequest({ method: "POST", url, data, token });
const apiPut = (url, data, { token } = {}) => apiRequest({ method: "PUT", url, data, token });
const apiDelete = (url, data, { token } = {}) => apiRequest({ method: "DELETE", url, data, token });
exports.apiDelete = apiDelete;
exports.apiGet = apiGet;
exports.apiPost = apiPost;
exports.apiPut = apiPut;
