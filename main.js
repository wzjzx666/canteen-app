import api from './api/index.js'
import App from './App'
import common from './api/common.js';
import store from '/src/store'  
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
// console.log('获取位置',getBackLocation.getAuthorise())
// getBackLocation.getAuthorise()
export function createApp() {
  const app = createSSRApp(App)
  app.use(store);
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$common = common;
  return {
    app
  }
}
// #endif