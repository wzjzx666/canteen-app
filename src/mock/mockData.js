import {
  canteens,
  categories,
  dishes,
  orders,
  user,
  canteenMap,
} from './data';

const withDelay = (data, timeout = 400) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), timeout);
  });

export const fetchCanteens = () => withDelay(canteens);

export const fetchCategories = (canteenId) =>
  withDelay(categories.filter((c) => c.canteenId === canteenId));

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

export const cancelOrder = (orderId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const target = orders.find((o) => o.id === orderId);
      if (target) target.status = 2;
      resolve(target);
    }, 450);
  });

export const fetchUser = () => withDelay(user);

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

