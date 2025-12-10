"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
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
    const tabList = [
      { name: "全部", value: -1 },
      { name: "待取餐", value: 0 },
      { name: "已完成", value: 1 },
      { name: "已取消", value: 2 }
    ];
    const currentTab = common_vendor.ref(0);
    const orders = common_vendor.ref([]);
    const showModal = common_vendor.ref(false);
    const pendingOrderId = common_vendor.ref(null);
    const loadOrders = async () => {
      const status = tabList[currentTab.value].value;
      orders.value = await src_mock_mockData.fetchOrders(status);
    };
    const onTabChange = ({ index }) => {
      currentTab.value = index;
      loadOrders();
    };
    const statusText = (status) => ["待取餐", "已完成", "已取消"][status] || "未知";
    const statusClass = (status) => ["pending", "success", "cancel"][status] || "";
    const confirmCancel = (orderId) => {
      pendingOrderId.value = orderId;
      showModal.value = true;
    };
    const handleCancel = async () => {
      if (!pendingOrderId.value)
        return;
      await src_mock_mockData.cancelOrder(pendingOrderId.value);
      common_vendor.index.showToast({ title: "取消成功", icon: "success" });
      showModal.value = false;
      loadOrders();
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
          var _a;
          return common_vendor.e({
            a: common_vendor.t(order.id),
            b: common_vendor.t(statusText(order.status)),
            c: common_vendor.n(statusClass(order.status)),
            d: common_vendor.t((_a = order.canteen) == null ? void 0 : _a.name),
            e: common_vendor.f(order.items, (item, k1, i1) => {
              return {
                a: common_vendor.t(item.name),
                b: common_vendor.t(item.count),
                c: common_vendor.t((item.price * item.count).toFixed(2)),
                d: item.dishId
              };
            }),
            f: common_vendor.t(order.totalPrice.toFixed(2)),
            g: order.status === 0
          }, order.status === 0 ? {
            h: common_vendor.o(($event) => confirmCancel(order.id), order.id),
            i: "456ecf67-1-" + i0,
            j: common_vendor.p({
              size: "mini",
              type: "error",
              shape: "circle"
            })
          } : {}, {
            k: order.id
          });
        }),
        d: common_vendor.o(handleCancel),
        e: common_vendor.o(($event) => showModal.value = false),
        f: common_vendor.p({
          show: showModal.value,
          title: "确认取消",
          content: "确认要取消该订单吗？"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-456ecf67"]]);
wx.createPage(MiniProgramPage);
