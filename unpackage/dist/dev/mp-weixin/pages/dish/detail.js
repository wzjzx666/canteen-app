"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_image2 + _easycom_uv_button2)();
}
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_button)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const dish = common_vendor.ref(null);
    const store = common_vendor.useStore();
    const canteenId = common_vendor.ref(null);
    const addToCart = () => {
      if (!dish.value)
        return;
      store.commit("cart/ADD_TO_CART", {
        dishId: dish.value.id,
        canteenId: canteenId.value,
        name: dish.value.name,
        price: dish.value.price,
        image: dish.value.image
      });
      common_vendor.index.showToast({ title: "已加入购物车", icon: "success" });
    };
    const buyNow = () => {
      addToCart();
      common_vendor.index.showToast({ title: "下单成功（模拟）", icon: "success" });
    };
    common_vendor.onLoad(async (options) => {
      const id = Number(options == null ? void 0 : options.id);
      canteenId.value = Number((options == null ? void 0 : options.canteenId) || 1);
      dish.value = await src_mock_mockData.fetchDishDetail(id);
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return {
        a: common_vendor.p({
          src: (_a = dish.value) == null ? void 0 : _a.image,
          width: "100%",
          height: "360rpx",
          mode: "aspectFill"
        }),
        b: common_vendor.t((_b = dish.value) == null ? void 0 : _b.name),
        c: common_vendor.t((_c = dish.value) == null ? void 0 : _c.sales),
        d: common_vendor.t((_d = dish.value) == null ? void 0 : _d.stock),
        e: common_vendor.t((_f = (_e = dish.value) == null ? void 0 : _e.price) == null ? void 0 : _f.toFixed(2)),
        f: common_vendor.t((_g = dish.value) == null ? void 0 : _g.description),
        g: common_vendor.o(addToCart),
        h: common_vendor.p({
          type: "primary",
          plain: true,
          shape: "circle"
        }),
        i: common_vendor.o(buyNow),
        j: common_vendor.p({
          type: "primary",
          shape: "circle"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-de90b20a"]]);
wx.createPage(MiniProgramPage);
