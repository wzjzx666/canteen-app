"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      version: "1.0.0",
      schoolName: "XX大学",
      feedbackContent: "",
      contactInfo: {
        phone: "010-12345678",
        email: "canteen@university.edu.cn",
        address: "XX大学第一食堂一楼服务台",
        workTime: "周一至周日 7:00-21:00"
      }
    };
  },
  methods: {
    callPhone() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.contactInfo.phone
      });
    },
    copyEmail() {
      common_vendor.index.setClipboardData({
        data: this.contactInfo.email,
        success: () => {
          common_vendor.index.showToast({
            title: "邮箱已复制",
            icon: "success"
          });
        }
      });
    },
    submitFeedback() {
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入意见内容",
          icon: "none"
        });
        return;
      }
      console.log("提交反馈:", this.feedbackContent);
      common_vendor.index.showToast({
        title: "感谢您的建议！",
        icon: "success"
      });
      this.feedbackContent = "";
    },
    checkUpdate() {
      common_vendor.index.showToast({
        title: "当前已是最新版本",
        icon: "none"
      });
    },
    showPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/privacy/index"
      });
    }
  }
};
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "info-circle",
      size: "18",
      color: "#333"
    }),
    b: common_vendor.p({
      name: "email",
      size: "18",
      color: "#333"
    }),
    c: common_vendor.p({
      name: "phone",
      size: "16",
      color: "#666"
    }),
    d: common_vendor.t($data.contactInfo.phone),
    e: common_vendor.p({
      name: "arrow-right",
      size: "14",
      color: "#ccc"
    }),
    f: common_vendor.o((...args) => $options.callPhone && $options.callPhone(...args)),
    g: common_vendor.p({
      name: "email",
      size: "16",
      color: "#666"
    }),
    h: common_vendor.t($data.contactInfo.email),
    i: common_vendor.p({
      name: "attach",
      size: "14",
      color: "#ccc"
    }),
    j: common_vendor.o((...args) => $options.copyEmail && $options.copyEmail(...args)),
    k: common_vendor.p({
      name: "map",
      size: "16",
      color: "#666"
    }),
    l: common_vendor.t($data.contactInfo.address),
    m: common_vendor.p({
      name: "clock",
      size: "16",
      color: "#666"
    }),
    n: common_vendor.t($data.contactInfo.workTime),
    o: common_vendor.p({
      name: "edit-pen",
      size: "18",
      color: "#333"
    }),
    p: $data.feedbackContent,
    q: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    r: common_vendor.o($options.submitFeedback),
    s: common_vendor.p({
      type: "primary"
    }),
    t: common_vendor.p({
      name: "setting",
      size: "18",
      color: "#333"
    }),
    v: common_vendor.t($data.version),
    w: common_vendor.t($data.schoolName),
    x: common_vendor.o($options.checkUpdate),
    y: common_vendor.p({
      type: "warning"
    }),
    z: common_vendor.o($options.showPrivacy),
    A: common_vendor.p({
      type: "error"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-38bc6bcf"]]);
wx.createPage(MiniProgramPage);
