"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_input2 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item2 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_radio2 = common_vendor.resolveComponent("uv-radio");
  const _easycom_uv_radio_group2 = common_vendor.resolveComponent("uv-radio-group");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_form2 = common_vendor.resolveComponent("uv-form");
  (_easycom_uv_input2 + _easycom_uv_form_item2 + _easycom_uv_icon2 + _easycom_uv_radio2 + _easycom_uv_radio_group2 + _easycom_uv_button2 + _easycom_uv_form2)();
}
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_radio = () => "../../uni_modules/uv-radio/components/uv-radio/uv-radio.js";
const _easycom_uv_radio_group = () => "../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
if (!Math) {
  (_easycom_uv_input + _easycom_uv_form_item + _easycom_uv_icon + _easycom_uv_radio + _easycom_uv_radio_group + _easycom_uv_button + _easycom_uv_form)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const loading = common_vendor.ref(false);
    const showPassword = common_vendor.ref(false);
    const form = common_vendor.reactive({
      username: "",
      password: "",
      role: "student"
    });
    const handleLogin = async () => {
      var _a;
      if (!form.username || !form.password) {
        common_vendor.index.showToast({ title: "请输入用户名和密码", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        const res = await proxy.$api.login({ username: form.username.trim(), password: form.password.trim() });
        if ((res == null ? void 0 : res.code) === 200 && ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.token)) {
          const token = res.data.token;
          common_vendor.index.setStorageSync("token", token);
          const profileRes = await proxy.$api.getProfile();
          if ((profileRes == null ? void 0 : profileRes.code) === 200 && (profileRes == null ? void 0 : profileRes.data)) {
            common_vendor.index.setStorageSync("userInfo", profileRes.data);
          }
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        } else {
          common_vendor.index.showToast({ title: (res == null ? void 0 : res.msg) || "登录失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "登录异常，请稍后重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        common_vendor.index.reLaunch({ url: "/pages/index/index" });
        return;
      }
    });
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/account/register" });
    };
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
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
        d: common_vendor.o(togglePasswordVisibility),
        e: common_vendor.p({
          name: showPassword.value ? "eye-fill" : "eye-off",
          size: "24",
          color: "#8c8c8c"
        }),
        f: common_vendor.o(($event) => form.password = $event),
        g: common_vendor.p({
          type: showPassword.value ? "text" : "password",
          placeholder: "请输入密码",
          border: "surround",
          modelValue: form.password
        }),
        h: common_vendor.p({
          label: "密码",
          prop: "password"
        }),
        i: common_vendor.p({
          label: "学生",
          name: "student"
        }),
        j: common_vendor.p({
          label: "教师",
          name: "teacher"
        }),
        k: common_vendor.p({
          label: "管理员",
          name: "admin"
        }),
        l: common_vendor.o(($event) => form.role = $event),
        m: common_vendor.p({
          placement: "column",
          modelValue: form.role
        }),
        n: common_vendor.p({
          label: "角色",
          prop: "role"
        }),
        o: common_vendor.o(handleLogin),
        p: common_vendor.p({
          type: "success",
          shape: "circle",
          loading: loading.value
        }),
        q: common_vendor.sr("formRef", "1095b067-0"),
        r: common_vendor.p({
          model: form
        }),
        s: common_vendor.o(goToRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1095b067"]]);
wx.createPage(MiniProgramPage);
