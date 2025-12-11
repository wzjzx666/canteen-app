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
  __name: "register",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const form = common_vendor.reactive({
      name: "",
      id: "",
      password: "",
      confirmPassword: "",
      role: "student"
      // 默认角色为学生
    });
    const handleRegister = async () => {
      if (!form.name || !form.id || !form.password) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (form.password !== form.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        const userInfo = {
          username: form.name,
          userId: form.id,
          role: form.role,
          registerTime: (/* @__PURE__ */ new Date()).getTime()
        };
        common_vendor.index.setStorageSync("userInfo", userInfo);
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.redirectTo({
            url: "/pages/account/login"
          });
        }, 1e3);
      }, 800);
    };
    const goToLogin = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => form.name = $event),
        b: common_vendor.p({
          placeholder: "请输入真实姓名",
          border: "surround",
          modelValue: form.name
        }),
        c: common_vendor.p({
          label: "姓名",
          prop: "name"
        }),
        d: common_vendor.o(($event) => form.id = $event),
        e: common_vendor.p({
          placeholder: "请输入学号或工号",
          border: "surround",
          modelValue: form.id
        }),
        f: common_vendor.p({
          label: "学号/工号",
          prop: "id"
        }),
        g: common_vendor.o(($event) => form.password = $event),
        h: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          border: "surround",
          modelValue: form.password
        }),
        i: common_vendor.p({
          label: "密码",
          prop: "password"
        }),
        j: common_vendor.o(($event) => form.confirmPassword = $event),
        k: common_vendor.p({
          type: "password",
          placeholder: "请再次输入密码",
          border: "surround",
          modelValue: form.confirmPassword
        }),
        l: common_vendor.p({
          label: "确认密码",
          prop: "confirmPassword"
        }),
        m: common_vendor.p({
          label: "学生",
          name: "student"
        }),
        n: common_vendor.p({
          label: "教师",
          name: "teacher"
        }),
        o: common_vendor.p({
          label: "管理员",
          name: "admin"
        }),
        p: common_vendor.o(($event) => form.role = $event),
        q: common_vendor.p({
          placement: "row",
          modelValue: form.role
        }),
        r: common_vendor.p({
          label: "角色",
          prop: "role"
        }),
        s: common_vendor.o(handleRegister),
        t: common_vendor.p({
          type: "success",
          shape: "circle",
          loading: loading.value
        }),
        v: common_vendor.sr(formRef, "bf3e7252-0", {
          "k": "formRef"
        }),
        w: common_vendor.p({
          model: form
        }),
        x: common_vendor.o(goToLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bf3e7252"]]);
wx.createPage(MiniProgramPage);
