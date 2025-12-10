import {
  canteens,
  categories,
  dishes,
  orders,
  users,
  user,
  canteenMap,
} from './data';

const withDelay = (data, timeout = 400) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), timeout);
  });

export const fetchCanteens = () => withDelay(canteens);

export const fetchCategories = (canteenId) => {
  if (canteenId) {
    return withDelay(categories.filter((c) => c.canteenId === canteenId));
  }
  return withDelay(categories);
};

export const fetchDishesByCanteen = (canteenId) => {
  const targetCategoryIds = categories
    .filter((c) => c.canteenId === canteenId)
    .map((c) => c.id);
  return withDelay(dishes.filter((d) => targetCategoryIds.includes(d.categoryId)));
};

export const fetchDishesByCategory = (categoryId) =>
  withDelay(dishes.filter((d) => d.categoryId === categoryId));

export const fetchDishDetail = (dishId) =>
  withDelay(dishes.find((d) => d.id === dishId));

export const fetchOrders = (status = -1) => {
  const filtered = status === -1 ? orders : orders.filter((o) => o.status === status);
  return withDelay(
    filtered.map((o) => ({
      ...o,
      canteen: canteenMap[o.canteenId],
    })),
  );
};

export const fetchOrderDetail = (orderId) => {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    return withDelay({
      ...order,
      canteen: canteenMap[order.canteenId],
      createTime: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000) // 随机生成近一周内的下单时间
    });
  }
  return withDelay(null);
};

export const cancelOrder = (orderId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const target = orders.find((o) => o.id === orderId);
      if (target) target.status = 2;
      resolve(target);
    }, 450);
  });

// 根据角色获取用户信息
export const fetchUser = () => {
  // 获取存储的用户信息
  const userInfo = uni.getStorageSync('userInfo');
  // 根据角色返回对应的用户数据
  if (userInfo && users[userInfo.role]) {
    return withDelay(users[userInfo.role]);
  }
  // 默认返回学生用户
  return withDelay(users.student);
};

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