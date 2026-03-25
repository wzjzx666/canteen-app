<template>
    <view class="content">
      <map id="map" class="map" :show-location="true" :latitude="latitude" :longitude="longitude" @markertap="handleMarkerClick"></map>
    </view>
  </template>
  
  <script>
  import { canteens } from '../../src/mock/data.js';

  const img = '/static/logo.png';

  export default {
    data() {
      // 计算所有食堂坐标的平均值作为地图中心点
      const lats = canteens.map(c => c.latitude);
      const lngs = canteens.map(c => c.longitude);
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      return {
        latitude: avgLat,
        longitude: avgLng
      };
    },
    computed: {
      canteenMarkers() {
        return canteens.map(c => ({
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
    onReady() {
      this._mapContext = uni.createMapContext("map", this);

      // 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
      this._mapContext.initMarkerCluster({
        enableDefaultStyle: false,
        zoomOnClick: true,
        gridSize: 60,
        complete(res) {
          console.log('initMarkerCluster', res)
        }
      });

      this._mapContext.on("markerClusterCreate", (e) => {
        console.log("markerClusterCreate", e);
      });

      this.addMarkers();
    },
    methods: {
      addMarkers() {
        // 使用真实食堂数据作为标记点
        const positions = this.canteenMarkers.map(m => ({
          latitude: m.latitude,
          longitude: m.longitude
        }));

        // 使用计算属性生成的食堂标记
        this._mapContext.addMarkers({
            markers: this.canteenMarkers,
            clear: false,
            complete: (res) => {
              console.log('addMarkers', res);
              this._mapContext.includePoints({
                points: positions,
                padding: [20],
                complete: (res) => {
                  console.log('includePoints', res);
                }
              });
            }
        })
      },
      handleMarkerClick(e) {
        const markerId = e.markerId;
        const canteen = canteens.find(c => c.id === markerId);
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
  