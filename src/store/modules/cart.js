import { getCartItems, setCartItems } from '../../utils/storage';

const state = () => ({
  cartItems: getCartItems(),
});

const getters = {
  totalCount: (state) => state.cartItems.reduce((sum, item) => sum + item.count, 0),
  totalPrice: (state) =>
    state.cartItems.reduce((sum, item) => sum + item.count * (item.price || 0), 0),
  currentCanteenCart: (state) => (canteenId) =>
    state.cartItems.filter((item) => item.canteenId === canteenId),
};

const mutations = {
  ADD_TO_CART(state, payload) {
    const { dishId, canteenId, name, price, image } = payload;
    const target = state.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.count += 1;
    } else {
      state.cartItems.push({
        dishId,
        canteenId,
        name,
        price,
        image,
        count: 1,
      });
    }
    setCartItems(state.cartItems);
  },
  REMOVE_FROM_CART(state, dishId) {
    const target = state.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.count -= 1;
      if (target.count <= 0) {
        state.cartItems = state.cartItems.filter((item) => item.dishId !== dishId);
      }
    }
    setCartItems(state.cartItems);
  },
  CLEAR_CART(state, canteenId = null) {
    if (canteenId) {
      state.cartItems = state.cartItems.filter((item) => item.canteenId !== canteenId);
    } else {
      state.cartItems = [];
    }
    setCartItems(state.cartItems);
  },
  DEDUCT_STOCK(state, { dishId, count }) {
    const target = state.cartItems.find((item) => item.dishId === dishId);
    if (target) {
      target.stock = Math.max((target.stock || 0) - count, 0);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};

