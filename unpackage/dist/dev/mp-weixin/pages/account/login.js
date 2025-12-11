"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_input2 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item2 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_radio2 = common_vendor.resolveComponent("uv-radio");
  const _easycom_uv_radio_group2 = common_vendor.resolveComponent("uv-radio-group");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_form2 = common_vendor.resolveComponent("uv-form");
  (_easycom_uv_input2 + _easycom_uv_form_item2 + _easycom_uv_radio2 + _easycom_uv_radio_group2 + _easycom_uv_button2 + _easycom_uv_form2)();
}
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_radio = () => "../../uni_modules/uv-radio/components/uv-radio/uv-radio.js";
const _easycom_uv_radio_group = () => "../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
if (!Math) {
  (_easycom_uv_input + _easycom_uv_form_item + _easycom_uv_radio + _easycom_uv_radio_group + _easycom_uv_button + _easycom_uv_form)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const form = common_vendor.reactive({
      username: "",
      password: "",
      role: "student"
      // 默认角色为学生
    });
    const handleLogin = async () => {
      if (!form.username || !form.password) {
        common_vendor.index.showToast({
          title: "请输入用户名和密码",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        const userInfo = {
          username: form.username,
          role: form.role,
          loginTime: (/* @__PURE__ */ new Date()).getTime()
        };
        common_vendor.index.setStorageSync("userInfo", userInfo);
        switch (form.role) {
          case "student":
          case "teacher":
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
            break;
          case "admin":
            common_vendor.index.navigateTo({
              url: "/pages/admin/dish-list"
            });
            break;
          default:
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
        }
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
      }, 800);
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/account/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => form.username = $event),
        b: common_vendor.p({
          placeholder: "请输入学号/工号",
          border: "surround",
          modelValue: form.username
        }),
        c: common_vendor.p({
          label: "用户名",
          prop: "username"
        }),
        d: common_vendor.o(($event) => form.password = $event),
        e: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          border: "surround",
          modelValue: form.password
        }),
        f: common_vendor.p({
          label: "密码",
          prop: "password"
        }),
        g: common_vendor.p({
          label: "学生",
          name: "student"
        }),
        h: common_vendor.p({
          label: "教师",
          name: "teacher"
        }),
        i: common_vendor.p({
          label: "管理员",
          name: "admin"
        }),
        j: common_vendor.o(($event) => form.role = $event),
        k: common_vendor.p({
          placement: "column",
          modelValue: form.role
        }),
        l: common_vendor.p({
          label: "角色",
          prop: "role"
        }),
        m: common_vendor.o(handleLogin),
        n: common_vendor.p({
          type: "success",
          shape: "circle",
          loading: loading.value
        }),
        o: common_vendor.sr(formRef, "1095b067-0", {
          "k": "formRef"
        }),
        p: common_vendor.p({
          model: form
        }),
        q: common_vendor.o(goToRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1095b067"]]);
wx.createPage(MiniProgramPage);
