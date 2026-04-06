"use strict";
const common_vendor = require("../../common/vendor.js");
const PREFIX = "smart_canteen_";
const buildKey = (key) => `${PREFIX}${key}`;
const getStorage = (key, defaultValue = null) => {
  try {
    const raw = common_vendor.index.getStorageSync(buildKey(key));
    return raw !== "" && raw !== null && raw !== void 0 ? raw : defaultValue;
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
exports.getCartItems = getCartItems;
exports.setCartItems = setCartItems;
