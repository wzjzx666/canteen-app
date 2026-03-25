"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  (_easycom_uv_icon2 + _easycom_uv_button2)();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_button)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const user = common_vendor.computed(() => store.state.user);
    const amountOptions = [10, 20, 50, 100, 200, 500];
    const selectedAmount = common_vendor.ref(0);
    const customAmount = common_vendor.ref("");
    const paymentMethod = common_vendor.ref("wechat");
    const finalAmount = common_vendor.computed(() => {
      if (customAmount.value && Number(customAmount.value) > 0) {
        return Number(customAmount.value);
      }
      return selectedAmount.value;
    });
    const onCustomInput = () => {
      if (customAmount.value) {
        selectedAmount.value = 0;
      }
    };
    const handleRecharge = async () => {
      if (finalAmount.value <= 0) {
        common_vendor.index.showToast({ title: "请选择充值金额", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "充值中..." });
      try {
        const result = await src_mock_mockData.recharge({
          amount: finalAmount.value,
          paymentMethod: paymentMethod.value
        });
        common_vendor.index.hideLoading();
        if (result.success) {
          common_vendor.index.showToast({ title: "充值成功", icon: "success" });
          await store.dispatch("loadUser");
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: result.message || "充值失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "充值失败", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      store.dispatch("loadUser");
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.t(((_b = (_a = user.value) == null ? void 0 : _a.balance) == null ? void 0 : _b.toFixed(2)) || "0.00"),
        b: common_vendor.f(amountOptions, (amt, k0, i0) => {
          return {
            a: common_vendor.t(amt),
            b: amt,
            c: selectedAmount.value === amt ? 1 : "",
            d: common_vendor.o(($event) => selectedAmount.value = amt, amt)
          };
        }),
        c: common_vendor.o([($event) => customAmount.value = $event.detail.value, onCustomInput]),
        d: customAmount.value,
        e: common_vendor.p({
          name: "wallet",
          color: "#00C853",
          size: "24"
        }),
        f: paymentMethod.value === "wechat"
      }, paymentMethod.value === "wechat" ? {} : {}, {
        g: paymentMethod.value === "wechat" ? 1 : "",
        h: common_vendor.o(($event) => paymentMethod.value = "wechat"),
        i: common_vendor.p({
          name: "wallet",
          color: "#00C853",
          size: "24"
        }),
        j: paymentMethod.value === "alipay"
      }, paymentMethod.value === "alipay" ? {} : {}, {
        k: paymentMethod.value === "alipay" ? 1 : "",
        l: common_vendor.o(($event) => paymentMethod.value = "alipay"),
        m: common_vendor.t(finalAmount.value.toFixed(2)),
        n: common_vendor.o(handleRecharge),
        o: common_vendor.p({
          type: "primary",
          shape: "circle",
          disabled: finalAmount.value <= 0
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f06186df"]]);
wx.createPage(MiniProgramPage);
