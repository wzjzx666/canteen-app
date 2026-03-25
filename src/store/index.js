import { createStore } from 'vuex';
import cart from './modules/cart';
import { fetchUser } from '../mock/mockData';

const store = createStore({
  state: () => ({
    user: null,
    loadingUser: false,
  }),
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_LOADING(state, loading) {
      state.loadingUser = loading;
    },
  },
  actions: {
    async loadUser({ commit }) {
      commit('SET_USER_LOADING', true);
      const res = await fetchUser();
      commit('SET_USER', res);
      commit('SET_USER_LOADING', false);
    },
  },
  modules: {
    cart,
  },
});

export default store;

