import { createStore } from 'vuex';
import cart from './modules/cart';
import { getProfile } from '../../request/index';

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
      try {
        const res = await getProfile();
        if (res?.code === 200 && res?.data) {
          commit('SET_USER', res.data);
        }
      } catch (e) {
        // ignore
      }
      commit('SET_USER_LOADING', false);
    },
  },
  modules: {
    cart,
  },
});

export default store;

