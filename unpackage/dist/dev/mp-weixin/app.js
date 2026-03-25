"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const api_index = require("./api/index.js");
const api_common = require("./api/common.js");
const src_store_index = require("./src/store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/canteen/detail.js";
  "./pages/dish/detail.js";
  "./pages/order/list.js";
  "./pages/mine/index.js";
  "./pages/aboutUs/index.js";
  "./pages/privacy/index.js";
  "./pages/order/detail.js";
  "./pages/account/login.js";
  "./pages/account/register.js";
  "./pages/recharge/index.js";
  "./pages/admin/dish-list.js";
  "./pages/admin/dish-edit.js";
  "./pages/map/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (!userInfo) {
      common_vendor.index.navigateTo({
        url: "/pages/account/login"
      });
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(src_store_index.store);
  app.config.globalProperties.$api = api_index.api;
  app.config.globalProperties.$common = api_common.common;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
