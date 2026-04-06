"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_cart = require("./modules/cart.js");
const request_index = require("../../request/index.js");
const store = common_vendor.createStore({
  state: () => ({
    user: null,
    loadingUser: false
  }),
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_LOADING(state, loading) {
      state.loadingUser = loading;
    }
  },
  actions: {
    async loadUser({ commit }) {
      commit("SET_USER_LOADING", true);
      try {
        const res = await request_index.getProfile();
        if ((res == null ? void 0 : res.code) === 200 && (res == null ? void 0 : res.data)) {
          commit("SET_USER", res.data);
        }
      } catch (e) {
      }
      commit("SET_USER_LOADING", false);
    }
  },
  modules: {
    cart: src_store_modules_cart.cart
  }
});
exports.store = store;
