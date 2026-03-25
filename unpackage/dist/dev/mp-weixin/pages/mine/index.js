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
    const currentUser = common_vendor.computed(() => store.state.user);
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo"));
    const displayName = common_vendor.computed(() => {
      if (!currentUser.value)
        return "未登录";
      return currentUser.value.name;
    });
    const goToOrders = () => {
      common_vendor.index.switchTab({ url: "/pages/order/list" });
    };
    const goRecharge = () => {
      common_vendor.index.navigateTo({ url: "/pages/recharge/index" });
    };
    const goAdmin = () => {
      common_vendor.index.navigateTo({ url: "/pages/admin/dish-list" });
    };
    const aboutUs = () => {
      common_vendor.index.navigateTo({ url: "/pages/aboutUs/index" });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            userInfo.value = null;
            common_vendor.index.redirectTo({
              url: "/pages/account/login"
            });
          }
        }
      });
    };
    common_vendor.onMounted(() => {
      store.dispatch("loadUser");
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      return common_vendor.e({
        a: common_vendor.p({
          src: (_a = currentUser.value) == null ? void 0 : _a.avatar,
          size: "70"
        }),
        b: common_vendor.t(displayName.value),
        c: ((_b = userInfo.value) == null ? void 0 : _b.role) === "student"
      }, ((_c = userInfo.value) == null ? void 0 : _c.role) === "student" ? {
        d: common_vendor.t((_d = currentUser.value) == null ? void 0 : _d.studentId)
      } : ((_e = userInfo.value) == null ? void 0 : _e.role) === "teacher" ? {
        f: common_vendor.t((_f = currentUser.value) == null ? void 0 : _f.studentId)
      } : {
        g: common_vendor.t((_g = currentUser.value) == null ? void 0 : _g.studentId)
      }, {
        e: ((_h = userInfo.value) == null ? void 0 : _h.role) === "teacher",
        h: ((_i = userInfo.value) == null ? void 0 : _i.role) !== "admin"
      }, ((_j = userInfo.value) == null ? void 0 : _j.role) !== "admin" ? {
        i: common_vendor.t((_l = (_k = currentUser.value) == null ? void 0 : _k.balance) == null ? void 0 : _l.toFixed(2))
      } : {}, {
        j: ((_m = userInfo.value) == null ? void 0 : _m.role) === "admin"
      }, ((_n = userInfo.value) == null ? void 0 : _n.role) === "admin" ? {
        k: common_vendor.o(goToOrders),
        l: common_vendor.p({
          title: "全部订单",
          isLink: true
        })
      } : {
        m: common_vendor.o(goToOrders),
        n: common_vendor.p({
          title: "我的订单",
          isLink: true
        })
      }, {
        o: ((_o = userInfo.value) == null ? void 0 : _o.role) !== "admin"
      }, ((_p = userInfo.value) == null ? void 0 : _p.role) !== "admin" ? {
        p: common_vendor.o(goRecharge),
        q: common_vendor.p({
          title: "账户充值",
          isLink: true
        })
      } : {}, {
        r: ((_q = userInfo.value) == null ? void 0 : _q.role) === "admin"
      }, ((_r = userInfo.value) == null ? void 0 : _r.role) === "admin" ? {
        s: common_vendor.o(goAdmin),
        t: common_vendor.p({
          title: "食堂管理端",
          isLink: true
        })
      } : {}, {
        v: common_vendor.o(aboutUs),
        w: common_vendor.p({
          title: "关于我们",
          isLink: true
        }),
        x: userInfo.value
      }, userInfo.value ? {
        y: common_vendor.o(logout),
        z: common_vendor.p({
          title: "退出登录",
          isLink: true
        })
      } : {}, {
        A: common_vendor.p({
          border: false
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-569e925a"]]);
wx.createPage(MiniProgramPage);
