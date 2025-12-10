"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
if (!Array) {
  const _easycom_uv_rate2 = common_vendor.resolveComponent("uv-rate");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_rate2 + _easycom_uv_image2 + _easycom_uni_icons2 + _easycom_uni_badge2 + _easycom_uv_button2)();
}
const _easycom_uv_rate = () => "../../uni_modules/uv-rate/components/uv-rate/uv-rate.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_rate + _easycom_uv_image + _easycom_uni_icons + _easycom_uni_badge + _easycom_uv_button)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const store = common_vendor.useStore();
    const canteenId = common_vendor.ref(null);
    const canteen = common_vendor.ref(null);
    const categoryList = common_vendor.ref([]);
    const dishList = common_vendor.ref([]);
    const selectedCategoryId = common_vendor.ref(null);
    const cartItems = common_vendor.computed(() => store.state.cart.cartItems);
    const totalCount = common_vendor.computed(() => store.getters["cart/totalCount"]);
    const totalPrice = common_vendor.computed(() => store.getters["cart/totalPrice"]);
    const filteredDishes = common_vendor.computed(() => {
      if (!selectedCategoryId.value)
        return [];
      return dishList.value.filter((d) => d.categoryId === selectedCategoryId.value);
    });
    const getCount = (dishId) => {
      const item = cartItems.value.find((c) => c.dishId === dishId);
      return item ? item.count : 0;
    };
    const addDish = (dish) => {
      store.commit("cart/ADD_TO_CART", {
        dishId: dish.id,
        canteenId: canteenId.value,
        name: dish.name,
        price: dish.price,
        image: dish.image
      });
    };
    const removeDish = (dish) => {
      if (getCount(dish.id) === 0)
        return;
      store.commit("cart/REMOVE_FROM_CART", dish.id);
    };
    const checkout = () => {
      if (totalCount.value === 0)
        return;
      common_vendor.index.showToast({ title: "提交订单成功（模拟）", icon: "success" });
      store.commit("cart/CLEAR_CART", canteenId.value);
    };
    const goCart = () => {
      common_vendor.index.showToast({ title: "当前为本地购物车", icon: "none" });
    };
    common_vendor.onLoad(async (options) => {
      var _a;
      canteenId.value = Number((options == null ? void 0 : options.canteenId) || 1);
      const [cats, dishes, canteens] = await Promise.all([
        src_mock_mockData.fetchCategories(canteenId.value),
        src_mock_mockData.fetchDishesByCanteen(canteenId.value),
        src_mock_mockData.fetchCanteens()
      ]);
      categoryList.value = cats;
      dishList.value = dishes;
      selectedCategoryId.value = ((_a = cats[0]) == null ? void 0 : _a.id) || null;
      canteen.value = canteens.find((c) => c.id === canteenId.value);
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return {
        a: common_vendor.t((_a = canteen.value) == null ? void 0 : _a.name),
        b: common_vendor.t((_b = canteen.value) == null ? void 0 : _b.location),
        c: common_vendor.p({
          value: ((_c = canteen.value) == null ? void 0 : _c.rating) || 0,
          readonly: true,
          activeColor: "#FF9800"
        }),
        d: common_vendor.t((_d = canteen.value) == null ? void 0 : _d.rating),
        e: common_vendor.f(categoryList.value, (cat, k0, i0) => {
          return {
            a: common_vendor.t(cat.name),
            b: cat.id,
            c: selectedCategoryId.value === cat.id ? 1 : "",
            d: common_vendor.o(($event) => selectedCategoryId.value = cat.id, cat.id)
          };
        }),
        f: common_vendor.f(filteredDishes.value, (dish, k0, i0) => {
          return {
            a: "699be342-1-" + i0,
            b: common_vendor.p({
              src: dish.image,
              width: "160rpx",
              height: "160rpx",
              radius: "16rpx"
            }),
            c: common_vendor.t(dish.name),
            d: common_vendor.t(dish.description),
            e: common_vendor.t(dish.sales),
            f: common_vendor.t(dish.stock),
            g: common_vendor.t(dish.price.toFixed(2)),
            h: "699be342-2-" + i0,
            i: common_vendor.o(($event) => removeDish(dish), dish.id),
            j: common_vendor.t(getCount(dish.id)),
            k: "699be342-3-" + i0,
            l: common_vendor.o(($event) => addDish(dish), dish.id),
            m: dish.id
          };
        }),
        g: common_vendor.p({
          type: "minus-filled",
          color: "#00C853",
          size: "24"
        }),
        h: common_vendor.p({
          type: "plus-filled",
          color: "#00C853",
          size: "24"
        }),
        i: common_vendor.p({
          type: "cart-filled",
          color: "#00C853",
          size: "28"
        }),
        j: common_vendor.p({
          text: totalCount.value,
          absolute: "rightTop",
          type: "success"
        }),
        k: common_vendor.t(totalPrice.value.toFixed(2)),
        l: common_vendor.o(goCart),
        m: common_vendor.o(checkout),
        n: common_vendor.p({
          type: "primary",
          shape: "circle",
          disabled: totalCount.value === 0
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-699be342"]]);
wx.createPage(MiniProgramPage);
