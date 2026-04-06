"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_tabs2 = common_vendor.resolveComponent("uv-tabs");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_modal2 = common_vendor.resolveComponent("uv-modal");
  (_easycom_uv_tabs2 + _easycom_uv_button2 + _easycom_uv_modal2)();
}
const _easycom_uv_tabs = () => "../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_uv_tabs + _easycom_uv_button + _easycom_uv_modal)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const tabList = [
      { name: "全部", value: null },
      { name: "待取餐", value: "pending" },
      { name: "已完成", value: "completed" },
      { name: "已取消", value: "canceled" }
    ];
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo"));
    const modal = common_vendor.ref(null);
    const currentTab = common_vendor.ref(0);
    const orders = common_vendor.ref([]);
    const pendingOrderId = common_vendor.ref(null);
    const loadOrders = async () => {
      const status = tabList[currentTab.value].value;
      const res = await proxy.$api.getOrders(status ? { status } : {});
      orders.value = (res == null ? void 0 : res.code) === 200 && Array.isArray(res.data) ? res.data : [];
    };
    const onTabChange = ({ index }) => {
      currentTab.value = index;
      loadOrders();
    };
    const statusText = (status) => ({ pending: "待取餐", completed: "已完成", canceled: "已取消" })[status] || "未知";
    const statusClass = (status) => ({ pending: "pending", completed: "success", canceled: "cancel" })[status] || "";
    const confirmCancel = (orderId) => {
      pendingOrderId.value = orderId;
      modal.value.open();
    };
    const goToDetail = (orderId) => {
      common_vendor.index.navigateTo({
        url: `/pages/order/detail?id=${orderId}`
      });
    };
    const handleCancel = async () => {
      if (!pendingOrderId.value)
        return;
      await proxy.$api.updateOrder(pendingOrderId.value, { status: "canceled" });
      common_vendor.index.showToast({ title: "取消成功", icon: "success" });
      modal.value.close();
      pendingOrderId.value = null;
      loadOrders();
    };
    const cancel = () => {
      modal.value.close();
      pendingOrderId.value = null;
    };
    common_vendor.onMounted(loadOrders);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onTabChange),
        b: common_vendor.p({
          list: tabList,
          current: currentTab.value,
          lineColor: "#00C853",
          activeStyle: "color:#00C853;font-weight:600;"
        }),
        c: common_vendor.f(orders.value, (order, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: common_vendor.t(order.id),
            b: common_vendor.t(statusText(order.status)),
            c: common_vendor.n(statusClass(order.status)),
            d: common_vendor.t((_a = order.canteen) == null ? void 0 : _a.name),
            e: common_vendor.f(order.items, (item, k1, i1) => {
              return {
                a: common_vendor.t(item.name),
                b: common_vendor.t(item.quantity),
                c: common_vendor.t((item.price * item.quantity).toFixed(2)),
                d: item.dishId
              };
            }),
            f: common_vendor.t(order.totalPrice.toFixed(2)),
            g: order.status === 0 && ((_b = userInfo.value) == null ? void 0 : _b.role) !== "admin"
          }, order.status === 0 && ((_c = userInfo.value) == null ? void 0 : _c.role) !== "admin" ? {
            h: common_vendor.o(($event) => confirmCancel(order.id), order.id),
            i: "456ecf67-1-" + i0,
            j: common_vendor.p({
              size: "mini",
              type: "error",
              shape: "circle"
            })
          } : {}, {
            k: order.id,
            l: common_vendor.o(($event) => goToDetail(order.id), order.id)
          });
        }),
        d: common_vendor.sr(modal, "456ecf67-2", {
          "k": "modal"
        }),
        e: common_vendor.o(handleCancel),
        f: common_vendor.o(cancel),
        g: common_vendor.p({
          title: "确认取消",
          showCancelButton: true,
          content: "确认要取消该订单吗？"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-456ecf67"]]);
wx.createPage(MiniProgramPage);
