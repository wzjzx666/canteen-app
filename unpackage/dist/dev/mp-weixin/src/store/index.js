"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_cart = require("./modules/cart.js");
const src_mock_mockData = require("../mock/mockData.js");
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
      const res = await src_mock_mockData.fetchUser();
      commit("SET_USER", res);
      commit("SET_USER_LOADING", false);
    }
  },
  modules: {
    cart: src_store_modules_cart.cart
  }
});
exports.store = store;
