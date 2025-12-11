"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_mockData = require("../../src/mock/mockData.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uv_navbar2 = common_vendor.resolveComponent("uv-navbar");
  const _easycom_uv_button2 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_swiper2 = common_vendor.resolveComponent("uv-swiper");
  const _easycom_uv_notice_bar2 = common_vendor.resolveComponent("uv-notice-bar");
  const _easycom_uv_image2 = common_vendor.resolveComponent("uv-image");
  const _easycom_uv_rate2 = common_vendor.resolveComponent("uv-rate");
  (_easycom_uni_icons2 + _easycom_uv_navbar2 + _easycom_uv_button2 + _easycom_uv_swiper2 + _easycom_uv_notice_bar2 + _easycom_uv_image2 + _easycom_uv_rate2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uv_navbar = () => "../../uni_modules/uv-navbar/components/uv-navbar/uv-navbar.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_swiper = () => "../../uni_modules/uv-swiper/components/uv-swiper/uv-swiper.js";
const _easycom_uv_notice_bar = () => "../../uni_modules/uv-notice-bar/components/uv-notice-bar/uv-notice-bar.js";
const _easycom_uv_image = () => "../../uni_modules/uv-image/components/uv-image/uv-image.js";
const _easycom_uv_rate = () => "../../uni_modules/uv-rate/components/uv-rate/uv-rate.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uv_navbar + _easycom_uv_button + _easycom_uv_swiper + _easycom_uv_notice_bar + _easycom_uv_image + _easycom_uv_rate)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const location = common_vendor.ref("校园内");
    const searchKeyword = common_vendor.ref("");
    const canteenList = common_vendor.ref([]);
    const bannerList = common_vendor.ref([
      {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=1200&q=60",
        title: "每日推荐"
      }
    ]);
    const notices = common_vendor.ref(["今日特供：红烧肉盖饭限时 8 折", "新品上架：孜然羊肉串", "充值满 100 送 10 元"]);
    common_vendor.index.getStorageSync("userInfo");
    const filteredCanteens = common_vendor.computed(() => {
      if (!searchKeyword.value)
        return canteenList.value;
      return canteenList.value.filter(
        (c) => c.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    });
    const buildBanner = async (canteenId) => {
      const dishes = await src_mock_mockData.fetchDishesByCanteen(canteenId);
      bannerList.value = dishes.slice(0, 4).map((d) => ({
        image: d.image,
        title: d.name
      }));
    };
    const loadCanteens = async () => {
      var _a;
      const list = await src_mock_mockData.fetchCanteens();
      canteenList.value = list;
      buildBanner(((_a = list[0]) == null ? void 0 : _a.id) || 1);
    };
    const goCanteen = (canteen) => {
      common_vendor.index.navigateTo({
        url: `/pages/canteen/detail?canteenId=${canteen.id}`
      });
    };
    const goSearch = () => {
      if (filteredCanteens.value.length > 0) {
        common_vendor.index.navigateTo({
          url: `/pages/search/result?keyword=${searchKeyword.value}`
        });
      } else {
        common_vendor.index.showToast({ title: "暂无匹配食堂", icon: "none" });
      }
    };
    const onLocate = async () => {
      common_vendor.index.navigateTo({
        url: "/pages/map/index"
      });
    };
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.redirectTo({
          url: "/pages/account/login"
        });
        return;
      }
      loadCanteens();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(),
        b: common_vendor.p({
          type: "location-filled",
          color: "#fff",
          size: "20"
        }),
        c: common_vendor.t(location.value),
        d: common_vendor.o(onLocate),
        e: common_vendor.p({
          placeholder: true,
          fixed: true,
          title: "智慧食堂",
          bgColor: "#00C853",
          titleStyle: "color:#fff;font-weight:600;"
        }),
        f: common_vendor.p({
          type: "search",
          color: "#9e9e9e",
          size: "18"
        }),
        g: searchKeyword.value,
        h: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        i: common_vendor.o(goSearch),
        j: common_vendor.p({
          type: "primary",
          size: "small",
          shape: "circle"
        }),
        k: common_vendor.p({
          list: bannerList.value,
          indicator: true,
          indicatorMode: "line",
          height: "360rpx",
          bgColor: "#E8F5E9",
          borderRadius: "20rpx",
          keyName: "image",
          autoplay: true,
          circular: true
        }),
        l: common_vendor.p({
          text: notices.value.join(" "),
          mode: "horizontal",
          color: "#00C853",
          bgColor: "#E8F5E9",
          volumeIcon: true,
          moreIcon: false
        }),
        m: common_vendor.f(filteredCanteens.value, (item, k0, i0) => {
          return {
            a: "1cf27b2a-6-" + i0,
            b: common_vendor.p({
              src: item.image,
              width: "220rpx",
              height: "220rpx",
              radius: "20rpx"
            }),
            c: common_vendor.t(item.name),
            d: "1cf27b2a-7-" + i0,
            e: common_vendor.t(item.location),
            f: "1cf27b2a-8-" + i0,
            g: common_vendor.p({
              count: 5,
              value: item.rating,
              activeColor: "#FF9800",
              readonly: true
            }),
            h: common_vendor.t(item.rating),
            i: item.id,
            j: common_vendor.o(($event) => goCanteen(item), item.id)
          };
        }),
        n: common_vendor.p({
          type: "location-filled",
          color: "#00C853",
          size: "18"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
