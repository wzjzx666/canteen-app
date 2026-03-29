import {
  canteens,
  categories,
  dishes,
  orders as initialOrders,
  users,
  user,
  canteenMap,
} from './data';
import {
  getOrdersStorage,
  setOrdersStorage,
  getUserInfoStorage,
} from '../utils/storage';
import { apiGet } from '/src/services/apiClient';

const useRealApi = () => uni.getStorageSync('use_real_api') !== false;

const withDelay = (data, timeout = 400) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), timeout);
  });

const getOrders = () => {
  const local = getOrdersStorage();
  if (Array.isArray(local) && local.length) return local;
  return initialOrders;
};

const setOrders = (list) => {
  setOrdersStorage(list);
};

const findOrderById = (orderId) => {
  const all = getOrders();
  const target = all.find((o) => o.id === orderId);
  return { all, target };
};

export const fetchCanteens = async () => {
  if (useRealApi()) {
    try {
      const res = await apiGet('/api/canteens');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // fallback 到本地 mock
    }
  }
  return withDelay(canteens);
};

export const fetchCategories = async (canteenId) => {
  if (useRealApi()) {
    try {
      const res = await apiGet('/api/categories', {
        params: { canteenId: canteenId || undefined },
      });
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // fallback
    }
  }
  if (canteenId) {
    return withDelay(categories.filter((c) => c.canteenId === canteenId));
  }
  return withDelay(categories);
};

export const fetchDishesByCanteen = async (canteenId) => {
  if (useRealApi()) {
    try {
      const res = await apiGet('/api/dishes', { params: { canteenId } });
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // fallback
    }
  }
  const targetCategoryIds = categories
    .filter((c) => c.canteenId === canteenId)
    .map((c) => c.id);
  return withDelay(dishes.filter((d) => targetCategoryIds.includes(d.categoryId)));
};

export const fetchDishesByCategory = async (categoryId) => {
  if (useRealApi()) {
    try {
      const res = await apiGet('/api/dishes', { params: { categoryId } });
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // fallback
    }
  }
  return withDelay(dishes.filter((d) => d.categoryId === categoryId));
};

export const fetchDishDetail = async (dishId) => {
  if (useRealApi()) {
    try {
      const res = await apiGet(`/api/dishes/${dishId}`);
      if (res?.success && res?.data) return res.data;
    } catch (e) {
      // fallback
    }
  }
  return withDelay(dishes.find((d) => d.id === dishId));
};

export const fetchOrders = (status = -1) => {
  const all = getOrders();
  const filtered = status === -1 ? all : all.filter((o) => o.status === status);
  return withDelay(
    filtered.map((o) => ({
      ...o,
      canteen: canteenMap[o.canteenId],
    })),
  );
};

export const fetchOrderDetail = (orderId) => {
  const { target } = findOrderById(orderId);
  const order = target;
  if (order) {
    return withDelay({
      ...order,
      canteen: canteenMap[order.canteenId],
      createTime: order.createTime || (Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    });
  }
  return withDelay(null);
};

export const cancelOrder = (orderId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const { all, target } = findOrderById(orderId);
      if (target) {
        target.status = 2;
        setOrders(all);
      }
      resolve(target || null);
    }, 450);
  });

// 根据角色获取用户信息
export const fetchUser = async () => {
  const localUser = getUserInfoStorage();
  if (localUser && localUser.role) return withDelay(localUser);

  if (useRealApi()) {
    const token = uni.getStorageSync('token');
    if (token) {
      try {
        const res = await apiGet('/api/auth/profile', { token });
        if (res?.code === 200 && res?.success !== false && res?.data) return res.data;
      } catch (e) {
        // fallback
      }
    }
  }

  return withDelay(users.student);
};

// 模拟支付订单
export const payOrder = (orderId, { payType }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const { all, target } = findOrderById(orderId);
      if (!target) {
        resolve({ success: false, message: '订单不存在' });
        return;
      }
      target.paid = true;
      target.payType = payType;
      // 支付完成后维持 status=0 作为“待取餐”
      setOrders(all);
      resolve({ success: true, order: target });
    }, 400);
  });

export const deductDishStock = ({ dishId, count }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const target = dishes.find((d) => d.id === dishId);
      if (target && target.stock >= count) {
        target.stock -= count;
        resolve({ success: true, stock: target.stock });
      } else {
        resolve({ success: false, stock: target ? target.stock : 0 });
      }
    }, 300);
  });

// 充值 API
export const recharge = ({ amount, paymentMethod }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (amount > 0) {
        // 获取当前用户角色
        const userInfo = uni.getStorageSync('userInfo');
        const currentUser = users[userInfo?.role] || users.student;
        currentUser.balance = (currentUser.balance || 0) + amount;
        resolve({ success: true, balance: currentUser.balance });
      } else {
        resolve({ success: false, message: '充值金额无效' });
      }
    }, 800);
  });

// 管理端：获取所有菜品
export const fetchAllDishes = () => withDelay(dishes);

// 管理端：切换上架/下架
export const toggleDishShelf = (dishId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const target = dishes.find((d) => d.id === dishId);
      if (target) {
        target.onShelf = !target.onShelf;
        resolve({ success: true, onShelf: target.onShelf });
      } else {
        resolve({ success: false, message: '菜品不存在' });
      }
    }, 300);
  });

// 管理端：保存菜品（更新）
export const saveDish = (dishId, data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const target = dishes.find((d) => d.id === dishId);
      if (target) {
        Object.assign(target, {
          name: data.name,
          categoryId: data.categoryId,
          price: data.price,
          stock: data.stock,
          description: data.description,
          image: data.image,
          onShelf: data.onShelf !== false,
        });
        resolve({ success: true, dish: target });
      } else {
        resolve({ success: false, message: '菜品不存在' });
      }
    }, 400);
  });

// 管理端：创建菜品
export const createDish = (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...dishes.map((d) => d.id), 0) + 1;
      const newDish = {
        id: newId,
        name: data.name,
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock,
        description: data.description || '',
        image: data.image || '',
        sales: 0,
        onShelf: data.onShelf !== false,
      };
      dishes.push(newDish);
      resolve({ success: true, dish: newDish });
    }, 400);
  });