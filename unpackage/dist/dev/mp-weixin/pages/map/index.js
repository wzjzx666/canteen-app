"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_data = require("../../src/mock/data.js");
const _sfc_main = {
  data() {
    const lats = src_mock_data.canteens.map((c) => c.latitude);
    const lngs = src_mock_data.canteens.map((c) => c.longitude);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    return {
      latitude: avgLat,
      longitude: avgLng
    };
  },
  computed: {
    canteenMarkers() {
      return src_mock_data.canteens.map((c) => ({
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
  onReady() {
    this._mapContext = common_vendor.index.createMapContext("map", this);
    this._mapContext.initMarkerCluster({
      enableDefaultStyle: false,
      zoomOnClick: true,
      gridSize: 60,
      complete(res) {
        console.log("initMarkerCluster", res);
      }
    });
    this._mapContext.on("markerClusterCreate", (e) => {
      console.log("markerClusterCreate", e);
    });
    this.addMarkers();
  },
  methods: {
    addMarkers() {
      const positions = this.canteenMarkers.map((m) => ({
        latitude: m.latitude,
        longitude: m.longitude
      }));
      this._mapContext.addMarkers({
        markers: this.canteenMarkers,
        clear: false,
        complete: (res) => {
          console.log("addMarkers", res);
          this._mapContext.includePoints({
            points: positions,
            padding: [20],
            complete: (res2) => {
              console.log("includePoints", res2);
            }
          });
        }
      });
    },
    handleMarkerClick(e) {
      const markerId = e.markerId;
      src_mock_data.canteens.find((c) => c.id === markerId);
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
