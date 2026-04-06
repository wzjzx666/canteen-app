"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_modal2 = common_vendor.resolveComponent("uv-modal");
  (_easycom_uv_button2 + _easycom_uv_modal2)();
}
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_uv_button + _easycom_uv_modal)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const order = common_vendor.ref({
      id: "",
      status: 0,
      items: [],
      totalPrice: 0,
      canteen: {},
      createTime: Date.now(),
      paid: false,
      payType: null,
      pickupCode: ""
    });
    const modal = common_vendor.ref(null);
    const pendingOrderId = common_vendor.ref(null);
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo"));
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const statusText = (status) => ["待取餐", "已完成", "已取消"][status] || "未知";
    const statusClass = (status) => ["pending", "success", "cancel"][status] || "";
    const calculateSubtotal = () => {
      return order.value.items.reduce((sum, item) => {
        return sum + item.price * item.count;
      }, 0);
    };
    const handlePay = async () => {
      if (!order.value.id || order.value.paid)
        return;
      try {
        common_vendor.index.showLoading({ title: "支付中..." });
        const res = await proxy.$api.updateOrder(order.value.id, { paid: true, payType: "校园卡", status: "pending" });
        common_vendor.index.hideLoading();
        if ((res == null ? void 0 : res.code) === 200) {
          order.value.paid = true;
          order.value.payType = "校园卡";
          common_vendor.index.showToast({ title: "支付成功", icon: "success" });
        } else {
          common_vendor.index.showToast({ title: "支付失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "支付失败", icon: "none" });
      }
    };
    const confirmCancel = () => {
      pendingOrderId.value = order.value.id;
      modal.value.open();
    };
    const handleCancel = async () => {
      if (!pendingOrderId.value)
        return;
      await proxy.$api.updateOrder(pendingOrderId.value, { status: "canceled" });
      common_vendor.index.showToast({ title: "取消成功", icon: "success" });
      modal.value.close();
      pendingOrderId.value = null;
      order.value.status = 2;
    };
    const cancel = () => {
      modal.value.close();
      pendingOrderId.value = null;
    };
    common_vendor.onLoad(async (options) => {
      if (options.id) {
        try {
          const res = await proxy.$api.getOrderById(options.id);
          if ((res == null ? void 0 : res.code) === 200 && (res == null ? void 0 : res.data)) {
            order.value = { ...order.value, ...res.data };
          }
        } catch (e) {
          common_vendor.index.showToast({ title: "获取订单详情失败", icon: "none" });
        }
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.t(statusText(order.value.status)),
        b: common_vendor.n(statusClass(order.value.status)),
        c: common_vendor.t(order.value.id),
        d: common_vendor.t((_a = order.value.canteen) == null ? void 0 : _a.name),
        e: common_vendor.t(formatTime(order.value.createTime)),
        f: order.value.pickupCode
      }, order.value.pickupCode ? {
        g: common_vendor.t(order.value.pickupCode)
      } : {}, {
        h: common_vendor.f(order.value.items, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.quantity),
            d: common_vendor.t((item.price * item.quantity).toFixed(2)),
            e: item.dishId
          };
        }),
        i: common_vendor.t(calculateSubtotal().toFixed(2)),
        j: common_vendor.t(order.value.totalPrice.toFixed(2)),
        k: ((_b = userInfo.value) == null ? void 0 : _b.role) !== "admin"
      }, ((_c = userInfo.value) == null ? void 0 : _c.role) !== "admin" ? common_vendor.e({
        l: !order.value.paid
      }, !order.value.paid ? {
        m: common_vendor.o(handlePay),
        n: common_vendor.p({
          type: "primary",
          shape: "circle"
        })
      } : {}, {
        o: order.value.status === 0
      }, order.value.status === 0 ? {
        p: common_vendor.o(confirmCancel),
        q: common_vendor.p({
          type: "error",
          shape: "circle"
        })
      } : {}) : {}, {
        r: common_vendor.sr(modal, "6b23c96c-2", {
          "k": "modal"
        }),
        s: common_vendor.o(handleCancel),
        t: common_vendor.o(cancel),
        v: common_vendor.p({
          title: "确认取消",
          showCancelButton: true,
          content: "确认要取消该订单吗？"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6b23c96c"]]);
wx.createPage(MiniProgramPage);
