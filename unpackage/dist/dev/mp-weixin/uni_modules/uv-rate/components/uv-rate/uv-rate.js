"use strict";
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvRate_components_uvRate_props = require("./props.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uv-rate",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvRate_components_uvRate_props.props],
  data() {
    return {
      // 生成一个唯一id，否则一个页面多个评分组件，会造成冲突
      elId: "",
      elClass: "",
      rateBoxLeft: 0,
      // 评分盒子左边到屏幕左边的距离，用于滑动选择时计算距离
      activeIndex: 0,
      rateWidth: 0,
      // 每个星星的宽度
      // 标识是否正在滑动，由于iOS事件上touch比click先触发，导致快速滑动结束后，接着触发click，导致事件混乱而出错
      moving: false
    };
  },
  watch: {
    value(newVal) {
      this.activeIndex = newVal;
    },
    modelValue(newVal) {
      this.activeIndex = newVal;
    }
  },
  created() {
    this.activeIndex = Number(this.value || this.modelValue);
    this.elId = this.$uv.guid();
    this.elClass = this.$uv.guid();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$uv.sleep(200).then(() => {
        this.getRateItemRect();
        this.getRateIconWrapRect();
      });
    },
    // 获取评分组件盒子的布局信息
    async getRateItemRect() {
      await this.$uv.sleep();
      this.$uvGetRect("#" + this.elId).then((res) => {
        this.rateBoxLeft = res.left;
      });
    },
    // 获取单个星星的尺寸
    getRateIconWrapRect() {
      this.$uvGetRect("." + this.elClass).then((res) => {
        this.rateWidth = res.width;
      });
    },
    // 手指滑动
    touchMove(e) {
      if (!this.touchable) {
        return;
      }
      this.preventEvent(e);
      const x = e.changedTouches && e.changedTouches[0].pageX || e.detail && e.detail.pageX;
      this.getActiveIndex(x);
    },
    // 停止滑动
    touchEnd(e) {
      if (!this.touchable) {
        return;
      }
      this.preventEvent(e);
      const x = e.changedTouches && e.changedTouches[0].pageX || e.detail && e.detail.pageX;
      this.getActiveIndex(x);
    },
    // 通过点击，直接选中
    clickHandler(e, index) {
      if (this.$uv.os() === "ios" && this.moving) {
        return;
      }
      this.preventEvent(e);
      let x = 0;
      x = e.changedTouches && e.changedTouches[0].pageX || e.detail && e.detail.pageX;
      this.getActiveIndex(x, true);
    },
    // 发出事件
    changeEvent() {
      this.$emit("change", this.activeIndex);
      this.$emit("input", this.activeIndex);
      this.$emit("update:modelValue", this.activeIndex);
    },
    // 获取当前激活的评分图标
    getActiveIndex(x, isClick = false) {
      if (this.disabled || this.readonly) {
        return;
      }
      const allRateWidth = this.rateWidth * this.count + this.rateBoxLeft;
      x = this.$uv.range(this.rateBoxLeft, allRateWidth, x) - this.rateBoxLeft;
      const distance = x;
      let index;
      if (this.allowHalf) {
        index = Math.floor(distance / this.rateWidth);
        const decimal = distance % this.rateWidth;
        if (decimal <= this.rateWidth / 2 && decimal > 0) {
          index += 0.5;
        } else if (decimal > this.rateWidth / 2) {
          index++;
        }
      } else {
        index = Math.floor(distance / this.rateWidth);
        const decimal = distance % this.rateWidth;
        if (isClick) {
          if (decimal > 0)
            index++;
        } else {
          if (decimal > this.rateWidth / 2)
            index++;
        }
      }
      this.activeIndex = Math.min(index, this.count);
      if (this.activeIndex < this.minCount) {
        this.activeIndex = this.minCount;
      }
      this.changeEvent();
      setTimeout(() => {
        this.moving = true;
      }, 10);
      setTimeout(() => {
        this.moving = false;
      }, 10);
    }
  }
};
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  _easycom_uv_icon2();
}
const _easycom_uv_icon = () => "../../../uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  _easycom_uv_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(Number(_ctx.count), (item, index, i0) => {
      return common_vendor.e({
        a: "48b72242-0-" + i0,
        b: common_vendor.p({
          name: Math.floor($data.activeIndex) > index ? _ctx.activeIcon : _ctx.inactiveIcon,
          color: _ctx.disabled ? "#c8c9cc" : Math.floor($data.activeIndex) > index ? _ctx.activeColor : _ctx.inactiveColor,
          ["custom-style"]: {
            "padding-left": _ctx.$uv.addUnit(_ctx.gutter / 2),
            "padding-right": _ctx.$uv.addUnit(_ctx.gutter / 2)
          },
          size: _ctx.size
        }),
        c: common_vendor.o(($event) => $options.clickHandler($event, index + 1), index)
      }, _ctx.allowHalf ? {
        d: "48b72242-1-" + i0,
        e: common_vendor.p({
          name: Math.ceil($data.activeIndex) > index ? _ctx.activeIcon : _ctx.inactiveIcon,
          color: _ctx.disabled ? "#c8c9cc" : Math.ceil($data.activeIndex) > index ? _ctx.activeColor : _ctx.inactiveColor,
          ["custom-style"]: {
            "padding-left": _ctx.$uv.addUnit(_ctx.gutter / 2),
            "padding-right": _ctx.$uv.addUnit(_ctx.gutter / 2)
          },
          size: _ctx.size
        }),
        f: common_vendor.o(($event) => $options.clickHandler($event, index + 1), index),
        g: common_vendor.s({
          width: _ctx.$uv.addUnit($data.rateWidth / 2)
        })
      } : {}, {
        h: index
      });
    }),
    b: _ctx.allowHalf,
    c: common_vendor.n($data.elClass),
    d: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    e: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args)),
    f: $data.elId,
    g: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-48b72242"]]);
wx.createComponent(Component);
