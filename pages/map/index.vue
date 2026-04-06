<template>
    <view class="content">
      <map id="map" class="map" :show-location="true" :latitude="latitude" :longitude="longitude" @markertap="handleMarkerClick"></map>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        latitude: 23.099994,
        longitude: 113.324520,
        canteens: []
      };
    },
    computed: {
      canteenMarkers() {
        return this.canteens.map(c => ({
          id: c.id,
          latitude: c.latitude || (23.099994 + Math.random() * 0.002 - 0.001),
          longitude: c.longitude || (113.324520 + Math.random() * 0.002 - 0.001),
          iconPath: '/static/logo.png',
          width: 30,
          height: 30,
          joinCluster: true,
          label: {
            content: c.name,
            bgColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 10,
            padding: 5,
            fontSize: 12,
            textAlign: 'center'
          }
        }));
      }
    },
    async onLoad() {
      const res = await this.$api.getCanteens();
      if (res?.code === 200 && Array.isArray(res.data)) {
        this.canteens = res.data;
      }
    },
    onReady() {
      this._mapContext = uni.createMapContext("map", this);
      this._mapContext.initMarkerCluster({
        enableDefaultStyle: false,
        zoomOnClick: true,
        gridSize: 60,
      });
      this._mapContext.on("markerClusterCreate", (e) => {});
      this.addMarkers();
    },
    methods: {
      addMarkers() {
        const positions = this.canteenMarkers.map(m => ({ latitude: m.latitude, longitude: m.longitude }));
        this._mapContext.addMarkers({
          markers: this.canteenMarkers,
          clear: false,
          complete: () => {
            this._mapContext.includePoints({ points: positions, padding: [20] });
          }
        });
      },
      handleMarkerClick(e) {
        const canteen = this.canteens.find(c => c.id === e.markerId);
        if (canteen) uni.showToast({ title: canteen.name, icon: 'none' });
      }
    }
  }
</script>
  
  <style>
    .content {
      position: relative;
      height: 100vh;
    }

    .map {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  </style>
  