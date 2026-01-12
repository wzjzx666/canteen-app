
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// 全局封装请求方法
Vue.prototype.$api = {
  get: async (url, params = {}) => {
    try {
      const [err, res] = await uni.request({
        url: `http://localhost:3000${ url }`,
        method: 'GET',
        data: params,
      });
      if (err) throw err;
      return res.data;
    } catch (err) {
      console.error('API请求失败:', err);
      return { success: false, error: err.message };
    }
  },
};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import store from '/src/store'  

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif