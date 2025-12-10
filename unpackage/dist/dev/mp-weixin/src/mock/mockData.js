"use strict";
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
const cancelOrder = (orderId) => new Promise((resolve) => {
  setTimeout(() => {
    const target = src_mock_data.orders.find((o) => o.id === orderId);
    if (target)
      target.status = 2;
    resolve(target);
  }, 450);
});
const fetchUser = () => withDelay(src_mock_data.user);
exports.cancelOrder = cancelOrder;
exports.fetchCanteens = fetchCanteens;
exports.fetchCategories = fetchCategories;
exports.fetchDishDetail = fetchDishDetail;
exports.fetchDishesByCanteen = fetchDishesByCanteen;
exports.fetchOrders = fetchOrders;
exports.fetchUser = fetchUser;
