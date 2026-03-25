"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
if (!Array) {
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_image2 + _easycom_uv_icon2 + _easycom_uv_button2)();
}
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_image + _easycom_uv_icon + _easycom_uv_button)();
}
const _sfc_main = {
  __name: "dish-edit",
  setup(__props) {
    const dishId = common_vendor.ref(null);
    const categoryOptions = common_vendor.ref([]);
    const categoryIndex = common_vendor.ref(0);
    const form = common_vendor.ref({
      name: "",
      categoryId: null,
      price: "",
      stock: "",
      description: "",
      image: "",
      onShelf: true
    });
    const onCategoryChange = (e) => {
      const index = Number(e.detail.value);
      categoryIndex.value = index;
      form.value.categoryId = categoryOptions.value[index].id;
    };
    const onShelfChange = (e) => {
      form.value.onShelf = e.detail.value;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          form.value.image = res.tempFilePaths[0];
        }
      });
    };
    const handleSave = async () => {
      if (!form.value.name) {
        common_vendor.index.showToast({ title: "请输入菜品名称", icon: "none" });
        return;
      }
      if (!form.value.categoryId) {
        common_vendor.index.showToast({ title: "请选择分类", icon: "none" });
        return;
      }
      if (!form.value.price || Number(form.value.price) <= 0) {
        common_vendor.index.showToast({ title: "请输入有效价格", icon: "none" });
        return;
      }
      if (!form.value.stock || Number(form.value.stock) < 0) {
        common_vendor.index.showToast({ title: "请输入有效库存", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "保存中..." });
      try {
        const data = {
          ...form.value,
          price: Number(form.value.price),
          stock: Number(form.value.stock)
        };
        let result;
        if (dishId.value) {
          result = await src_mock_mockData.saveDish(dishId.value, data);
        } else {
          result = await src_mock_mockData.createDish(data);
        }
        common_vendor.index.hideLoading();
        if (result.success) {
          common_vendor.index.showToast({ title: "保存成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: result.message || "保存失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      }
    };
    common_vendor.onLoad(async (options) => {
      if (options.id) {
        dishId.value = Number(options.id);
        const dish = await src_mock_mockData.fetchDishDetail(dishId.value);
        if (dish) {
          form.value = {
            name: dish.name,
            categoryId: dish.categoryId,
            price: String(dish.price),
            stock: String(dish.stock),
            description: dish.description || "",
            image: dish.image || "",
            onShelf: dish.onShelf !== false
          };
          const catIndex = categoryOptions.value.findIndex((c) => c.id === dish.categoryId);
          if (catIndex >= 0)
            categoryIndex.value = catIndex;
        }
      }
      const categories = await src_mock_mockData.fetchCategories();
      categoryOptions.value = categories;
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: form.value.name,
        b: common_vendor.o(($event) => form.value.name = $event.detail.value),
        c: common_vendor.t(form.value.categoryId ? (_a = categoryOptions.value.find((c) => c.id === form.value.categoryId)) == null ? void 0 : _a.name : "请选择分类"),
        d: categoryOptions.value,
        e: categoryIndex.value,
        f: common_vendor.o(onCategoryChange),
        g: form.value.price,
        h: common_vendor.o(($event) => form.value.price = $event.detail.value),
        i: form.value.stock,
        j: common_vendor.o(($event) => form.value.stock = $event.detail.value),
        k: form.value.description,
        l: common_vendor.o(($event) => form.value.description = $event.detail.value),
        m: form.value.image
      }, form.value.image ? {
        n: common_vendor.p({
          src: form.value.image,
          width: "200rpx",
          height: "200rpx",
          radius: "16rpx",
          mode: "aspectFill"
        })
      } : {
        o: common_vendor.p({
          name: "camera",
          size: "40",
          color: "#ccc"
        }),
        p: common_vendor.o(chooseImage)
      }, {
        q: form.value.onShelf,
        r: common_vendor.o(onShelfChange),
        s: common_vendor.o(handleSave),
        t: common_vendor.p({
          type: "primary",
          shape: "circle"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cb84671a"]]);
wx.createPage(MiniProgramPage);
