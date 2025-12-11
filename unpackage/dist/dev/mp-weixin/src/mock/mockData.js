"use strict";
const common_vendor = require("../../common/vendor.js");
const src_mock_data = require("./data.js");
const withDelay = (data, timeout = 400) => new Promise((resolve) => {
  setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), timeout);
});
const fetchCanteens = () => withDelay(src_mock_data.canteens);
const fetchCategories = (canteenId) => {
  if (canteenId) {
    return withDelay(src_mock_data.categories.filter((c) => c.canteenId === canteenId));
  }
  return withDelay(src_mock_data.categories);
};
const fetchDishesByCanteen = (canteenId) => {
  const targetCategoryIds = src_mock_data.categories.filter((c) => c.canteenId === canteenId).map((c) => c.id);
  return withDelay(src_mock_data.dishes.filter((d) => targetCategoryIds.includes(d.categoryId)));
};
const fetchDishDetail = (dishId) => withDelay(src_mock_data.dishes.find((d) => d.id === dishId));
const fetchOrders = (status = -1) => {
  const filtered = status === -1 ? src_mock_data.orders : src_mock_data.orders.filter((o) => o.status === status);
  return withDelay(
    filtered.map((o) => ({
      ...o,
      canteen: src_mock_data.canteenMap[o.canteenId]
    }))
  );
};
const fetchOrderDetail = (orderId) => {
  const order = src_mock_data.orders.find((o) => o.id === orderId);
  if (order) {
    return withDelay({
      ...order,
      canteen: src_mock_data.canteenMap[order.canteenId],
      createTime: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1e3)
      // 随机生成近一周内的下单时间
    });
  }
  return withDelay(null);
};
const cancelOrder = (orderId) => new Promise((resolve) => {
  setTimeout(() => {
    const target = src_mock_data.orders.find((o) => o.id === orderId);
    if (target)
      target.status = 2;
    resolve(target);
  }, 450);
});
const fetchUser = () => {
  const userInfo = common_vendor.index.getStorageSync("userInfo");
  if (userInfo && src_mock_data.users[userInfo.role]) {
    return withDelay(src_mock_data.users[userInfo.role]);
  }
  return withDelay(src_mock_data.users.student);
};
const recharge = ({ amount, paymentMethod }) => new Promise((resolve) => {
  setTimeout(() => {
    if (amount > 0) {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const currentUser = src_mock_data.users[userInfo == null ? void 0 : userInfo.role] || src_mock_data.users.student;
      currentUser.balance = (currentUser.balance || 0) + amount;
      resolve({ success: true, balance: currentUser.balance });
    } else {
      resolve({ success: false, message: "充值金额无效" });
    }
  }, 800);
});
const fetchAllDishes = () => withDelay(src_mock_data.dishes);
const toggleDishShelf = (dishId) => new Promise((resolve) => {
  setTimeout(() => {
    const target = src_mock_data.dishes.find((d) => d.id === dishId);
    if (target) {
      target.onShelf = !target.onShelf;
      resolve({ success: true, onShelf: target.onShelf });
    } else {
      resolve({ success: false, message: "菜品不存在" });
    }
  }, 300);
});
const saveDish = (dishId, data) => new Promise((resolve) => {
  setTimeout(() => {
    const target = src_mock_data.dishes.find((d) => d.id === dishId);
    if (target) {
      Object.assign(target, {
        name: data.name,
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock,
        description: data.description,
        image: data.image,
        onShelf: data.onShelf !== false
      });
      resolve({ success: true, dish: target });
    } else {
      resolve({ success: false, message: "菜品不存在" });
    }
  }, 400);
});
const createDish = (data) => new Promise((resolve) => {
  setTimeout(() => {
    const newId = Math.max(...src_mock_data.dishes.map((d) => d.id), 0) + 1;
    const newDish = {
      id: newId,
      name: data.name,
      categoryId: data.categoryId,
      price: data.price,
      stock: data.stock,
      description: data.description || "",
      image: data.image || "",
      sales: 0,
      onShelf: data.onShelf !== false
    };
    src_mock_data.dishes.push(newDish);
    resolve({ success: true, dish: newDish });
  }, 400);
});
exports.cancelOrder = cancelOrder;
exports.createDish = createDish;
exports.fetchAllDishes = fetchAllDishes;
exports.fetchCanteens = fetchCanteens;
exports.fetchCategories = fetchCategories;
exports.fetchDishDetail = fetchDishDetail;
exports.fetchDishesByCanteen = fetchDishesByCanteen;
exports.fetchOrderDetail = fetchOrderDetail;
exports.fetchOrders = fetchOrders;
exports.fetchUser = fetchUser;
exports.recharge = recharge;
exports.saveDish = saveDish;
exports.toggleDishShelf = toggleDishShelf;
