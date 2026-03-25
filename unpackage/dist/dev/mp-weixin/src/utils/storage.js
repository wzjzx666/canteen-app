"use strict";
const common_vendor = require("../../common/vendor.js");
const PREFIX = "smart_canteen_";
const buildKey = (key) => `${PREFIX}${key}`;
const getStorage = (key, defaultValue = null) => {
  try {
    const raw = common_vendor.index.getStorageSync(buildKey(key));
    if (!raw)
      return defaultValue;
    return raw;
  } catch (e) {
    return defaultValue;
  }
};
const setStorage = (key, value) => {
  try {
    common_vendor.index.setStorageSync(buildKey(key), value);
  } catch (e) {
  }
};
const getCartItems = () => getStorage("cart_items", []);
const setCartItems = (items) => setStorage("cart_items", items);
const getOrdersStorage = () => getStorage("orders", []);
const setOrdersStorage = (orders) => setStorage("orders", orders);
const getUserInfoStorage = () => common_vendor.index.getStorageSync("userInfo");
const getLocalAccounts = () => getStorage("local_accounts", []);
const setLocalAccounts = (accounts) => setStorage("local_accounts", accounts);
exports.getCartItems = getCartItems;
exports.getLocalAccounts = getLocalAccounts;
exports.getOrdersStorage = getOrdersStorage;
exports.getUserInfoStorage = getUserInfoStorage;
exports.setCartItems = setCartItems;
exports.setLocalAccounts = setLocalAccounts;
exports.setOrdersStorage = setOrdersStorage;
