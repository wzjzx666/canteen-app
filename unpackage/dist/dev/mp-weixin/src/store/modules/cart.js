"use strict";
const state = () => ({
  cartItems: []
});
const getters = {
  totalCount: (state2) => state2.cartItems.reduce((sum, item) => sum + item.count, 0),
  totalPrice: (state2) => state2.cartItems.reduce((sum, item) => sum + item.count * (item.price || 0), 0),
  currentCanteenCart: (state2) => (canteenId) => state2.cartItems.filter((item) => item.canteenId === canteenId)
};
const mutations = {
  ADD_TO_CART(state2, payload) {
    const { dishId, canteenId, name, price, image } = payload;
    const target = state2.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.count += 1;
    } else {
      state2.cartItems.push({
        dishId,
        canteenId,
        name,
        price,
        image,
        count: 1
      });
    }
  },
  REMOVE_FROM_CART(state2, dishId) {
    const target = state2.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.count -= 1;
      if (target.count <= 0) {
        state2.cartItems = state2.cartItems.filter((item) => item.dishId !== dishId);
      }
    }
  },
  CLEAR_CART(state2, canteenId = null) {
    if (canteenId) {
      state2.cartItems = state2.cartItems.filter((item) => item.canteenId !== canteenId);
    } else {
      state2.cartItems = [];
    }
  },
  DEDUCT_STOCK(state2, { dishId, count }) {
    const target = state2.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.stock = Math.max((target.stock || 0) - count, 0);
    }
  }
};
const cart = {
  namespaced: true,
  state,
  getters,
  mutations
};
exports.cart = cart;
