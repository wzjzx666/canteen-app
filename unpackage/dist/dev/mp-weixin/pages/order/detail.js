"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
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
    const order = common_vendor.ref({
      id: "",
      status: 0,
      items: [],
      totalPrice: 0,
      canteen: {},
      createTime: Date.now()
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
    const confirmCancel = () => {
      pendingOrderId.value = order.value.id;
      modal.value.open();
    };
    const handleCancel = async () => {
      if (!pendingOrderId.value)
        return;
      await src_mock_mockData.cancelOrder(pendingOrderId.value);
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
          const data = await src_mock_mockData.fetchOrderDetail(options.id);
          order.value = { ...order.value, ...data };
        } catch (error) {
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
        f: common_vendor.f(order.value.items, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.count),
            d: common_vendor.t((item.price * item.count).toFixed(2)),
            e: item.dishId
          };
        }),
        g: common_vendor.t(calculateSubtotal().toFixed(2)),
        h: common_vendor.t(order.value.totalPrice.toFixed(2)),
        i: order.value.status === 0 && ((_b = userInfo.value) == null ? void 0 : _b.role) !== "admin"
      }, order.value.status === 0 && ((_c = userInfo.value) == null ? void 0 : _c.role) !== "admin" ? {
        j: common_vendor.o(confirmCancel),
        k: common_vendor.p({
          type: "error",
          shape: "circle"
        })
      } : {}, {
        l: common_vendor.sr(modal, "6b23c96c-1", {
          "k": "modal"
        }),
        m: common_vendor.o(handleCancel),
        n: common_vendor.o(cancel),
        o: common_vendor.p({
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
