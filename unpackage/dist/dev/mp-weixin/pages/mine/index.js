"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_uv_cell2 = common_vendor.resolveComponent("uv-cell");
  const _easycom_uv_cell_group2 = common_vendor.resolveComponent("uv-cell-group");
  (_easycom_uv_avatar2 + _easycom_uv_cell2 + _easycom_uv_cell_group2)();
}
const _easycom_uv_avatar = () => "../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_uv_cell = () => "../../uni_modules/uv-cell/components/uv-cell/uv-cell.js";
const _easycom_uv_cell_group = () => "../../uni_modules/uv-cell/components/uv-cell-group/uv-cell-group.js";
if (!Math) {
  (_easycom_uv_avatar + _easycom_uv_cell + _easycom_uv_cell_group)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const user = common_vendor.computed(() => store.state.user);
    const goRecharge = () => {
      common_vendor.index.navigateTo({ url: "/pages/recharge/index" });
    };
    const goAdmin = () => {
      common_vendor.index.navigateTo({ url: "/pages/admin/dish-list" });
    };
    const aboutUs = () => {
      common_vendor.index.navigateTo({ url: "/pages/aboutUs/index" });
    };
    common_vendor.onMounted(() => {
      store.dispatch("loadUser");
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return {
        a: common_vendor.p({
          src: (_a = user.value) == null ? void 0 : _a.avatar,
          size: "70"
        }),
        b: common_vendor.t(((_b = user.value) == null ? void 0 : _b.name) || "未登录"),
        c: common_vendor.t((_c = user.value) == null ? void 0 : _c.studentId),
        d: common_vendor.t((_e = (_d = user.value) == null ? void 0 : _d.balance) == null ? void 0 : _e.toFixed(2)),
        e: common_vendor.p({
          title: "我的订单",
          isLink: true,
          url: "/pages/order/list"
        }),
        f: common_vendor.o(goRecharge),
        g: common_vendor.p({
          title: "账户充值",
          isLink: true
        }),
        h: common_vendor.o(goAdmin),
        i: common_vendor.p({
          title: "食堂管理端",
          isLink: true
        }),
        j: common_vendor.o(goAdmin),
        k: common_vendor.p({
          title: "账号管理",
          isLink: true
        }),
        l: common_vendor.o(aboutUs),
        m: common_vendor.p({
          title: "关于我们",
          isLink: true
        }),
        n: common_vendor.p({
          border: false
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-569e925a"]]);
wx.createPage(MiniProgramPage);
