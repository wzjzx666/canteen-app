// 统一封装本地存储读写，确保与论文中“UniApp Storage API”描述一致

const PREFIX = 'smart_canteen_';

const buildKey = (key) => `${PREFIX}${key}`;

export const getStorage = (key, defaultValue = null) => {
  try {
    const raw = uni.getStorageSync(buildKey(key));
    if (!raw) return defaultValue;
    return raw;
  } catch (e) {
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    uni.setStorageSync(buildKey(key), value);
  } catch (e) {
    // ignore
  }
};

export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(buildKey(key));
  } catch (e) {
    // ignore
  }
};

// 购物车
export const getCartItems = () => getStorage('cart_items', []);

export const setCartItems = (items) => setStorage('cart_items', items);

// 订单
export const getOrdersStorage = () => getStorage('orders', []);

export const setOrdersStorage = (orders) => setStorage('orders', orders);

// 搜索历史
export const getSearchHistory = () => getStorage('search_history', []);

export const setSearchHistory = (list) => setStorage('search_history', list);

// 用户信息（与登录页保持一致 key）
export const getUserInfoStorage = () => uni.getStorageSync('userInfo');

// 本地注册账号
export const getLocalAccounts = () => getStorage('local_accounts', []);

export const setLocalAccounts = (accounts) => setStorage('local_accounts', accounts);

