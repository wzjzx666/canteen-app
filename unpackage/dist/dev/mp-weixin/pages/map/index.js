"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 23.099994,
      longitude: 113.32452,
      canteens: []
    };
  },
  computed: {
    canteenMarkers() {
      return this.canteens.map((c) => ({
        id: c.id,
        latitude: c.latitude || 23.099994 + Math.random() * 2e-3 - 1e-3,
        longitude: c.longitude || 113.32452 + Math.random() * 2e-3 - 1e-3,
        iconPath: "/static/logo.png",
        width: 30,
        height: 30,
        joinCluster: true,
        label: {
          content: c.name,
          bgColor: "#ffffff",
          borderWidth: 1,
          borderRadius: 10,
          padding: 5,
          fontSize: 12,
          textAlign: "center"
        }
      }));
    }
  },
  async onLoad() {
    const res = await this.$api.getCanteens();
    if ((res == null ? void 0 : res.code) === 200 && Array.isArray(res.data)) {
      this.canteens = res.data;
    }
  },
  onReady() {
    this._mapContext = common_vendor.index.createMapContext("map", this);
    this._mapContext.initMarkerCluster({
      enableDefaultStyle: false,
      zoomOnClick: true,
      gridSize: 60
    });
    this._mapContext.on("markerClusterCreate", (e) => {
    });
    this.addMarkers();
  },
  methods: {
    addMarkers() {
      const positions = this.canteenMarkers.map((m) => ({ latitude: m.latitude, longitude: m.longitude }));
      this._mapContext.addMarkers({
        markers: this.canteenMarkers,
        clear: false,
        complete: () => {
          this._mapContext.includePoints({ points: positions, padding: [20] });
        }
      });
    },
    handleMarkerClick(e) {
      const canteen = this.canteens.find((c) => c.id === e.markerId);
      if (canteen)
        common_vendor.index.showToast({ title: canteen.name, icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.latitude,
    b: $data.longitude,
    c: common_vendor.o((...args) => $options.handleMarkerClick && $options.handleMarkerClick(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
