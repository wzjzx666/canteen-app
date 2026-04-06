"use strict";
const common_vendor = require("../../common/vendor.js");
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
  __name: "dish-list",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const canteens = common_vendor.ref([]);
    const dishes = common_vendor.ref([]);
    const categories = common_vendor.ref([]);
    const selectedCanteen = common_vendor.ref(0);
    const filteredDishes = common_vendor.computed(() => {
      if (selectedCanteen.value === 0)
        return dishes.value;
      const canteenCategoryIds = categories.value.filter((cat) => cat.canteenId === selectedCanteen.value).map((cat) => cat.id);
      return dishes.value.filter((d) => canteenCategoryIds.includes(d.categoryId));
    });
    const toggleShelf = async (dish) => {
      common_vendor.index.showLoading({ title: "处理中..." });
      try {
        const res = await proxy.$api.updateDish(dish.id, { available: !dish.available });
        common_vendor.index.hideLoading();
        if ((res == null ? void 0 : res.code) === 200) {
          dish.available = !dish.available;
          common_vendor.index.showToast({ title: dish.available ? "已上架" : "已下架", icon: "success" });
        } else {
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const editDish = (dish) => {
      common_vendor.index.navigateTo({
        url: `/pages/admin/dish-edit?id=${dish.id}`
      });
    };
    const addDish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/admin/dish-edit"
      });
    };
    common_vendor.onMounted(async () => {
      const [canteensRes, dishesRes, categoriesRes] = await Promise.all([
        proxy.$api.getCanteens(),
        proxy.$api.getDishes(),
        proxy.$api.getCategories()
      ]);
      canteens.value = (canteensRes == null ? void 0 : canteensRes.code) === 200 && Array.isArray(canteensRes.data) ? canteensRes.data : [];
      dishes.value = (dishesRes == null ? void 0 : dishesRes.code) === 200 && Array.isArray(dishesRes.data) ? dishesRes.data : [];
      categories.value = (categoriesRes == null ? void 0 : categoriesRes.code) === 200 && Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
    });
    return (_ctx, _cache) => {
      return {
        a: selectedCanteen.value === 0 ? 1 : "",
        b: common_vendor.o(($event) => selectedCanteen.value = 0),
        c: common_vendor.f(canteens.value, (c, k0, i0) => {
          return {
            a: common_vendor.t(c.name),
            b: c.id,
            c: selectedCanteen.value === c.id ? 1 : "",
            d: common_vendor.o(($event) => selectedCanteen.value = c.id, c.id)
          };
        }),
        d: common_vendor.f(filteredDishes.value, (dish, k0, i0) => {
          return {
            a: "7728cb2c-0-" + i0,
            b: common_vendor.p({
              src: dish.image,
              width: "160rpx",
              height: "160rpx",
              radius: "16rpx"
            }),
            c: common_vendor.t(dish.name),
            d: common_vendor.t(dish.onShelf ? "已上架" : "已下架"),
            e: dish.onShelf ? 1 : "",
            f: !dish.onShelf ? 1 : "",
            g: common_vendor.t(dish.description),
            h: common_vendor.t(dish.price.toFixed(2)),
            i: common_vendor.t(dish.stock),
            j: common_vendor.t(dish.sales),
            k: common_vendor.t(dish.onShelf ? "下架" : "上架"),
            l: common_vendor.o(($event) => toggleShelf(dish), dish.id),
            m: "7728cb2c-1-" + i0,
            n: common_vendor.p({
              type: dish.onShelf ? "warning" : "success",
              size: "mini",
              shape: "circle"
            }),
            o: common_vendor.o(($event) => editDish(dish), dish.id),
            p: "7728cb2c-2-" + i0,
            q: dish.id
          };
        }),
        e: common_vendor.p({
          type: "primary",
          size: "mini",
          shape: "circle"
        }),
        f: common_vendor.o(addDish),
        g: common_vendor.p({
          type: "primary",
          shape: "circle"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7728cb2c"]]);
wx.createPage(MiniProgramPage);
