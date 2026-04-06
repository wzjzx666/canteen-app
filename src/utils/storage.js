const PREFIX = 'smart_canteen_';
const buildKey = (key) => `${PREFIX}${key}`;

export const getStorage = (key, defaultValue = null) => {
  try {
    const raw = uni.getStorageSync(buildKey(key));
    return raw !== '' && raw !== null && raw !== undefined ? raw : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try { uni.setStorageSync(buildKey(key), value); } catch (e) {}
};

// 购物车
export const getCartItems = () => getStorage('cart_items', []);
export const setCartItems = (items) => setStorage('cart_items', items);
