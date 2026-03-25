<template>
  <view class="container">
    <view class="canteen-header">
      <view>
        <view class="title">{{ canteen?.name }}</view>
        <view class="sub">{{ canteen?.location }}</view>
      </view>
      <view class="rating">
        <uv-rate :value="canteen?.rating || 0" readonly activeColor="#FF9800" />
        <text class="score">{{ canteen?.rating }}</text>
      </view>
    </view>

    <view class="content">
      <scroll-view scroll-y class="sidebar">
        <view
          v-for="cat in categoryList"
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: selectedCategoryId === cat.id }"
          @click="selectedCategoryId = cat.id"
        >
          {{ cat.name }}
        </view>
      </scroll-view>

      <scroll-view scroll-y class="dish-area">
        <view
          v-for="dish in filteredDishes"
          :key="dish.id"
          class="dish-card"
        >
          <uv-image :src="dish.image" width="160rpx" height="160rpx" radius="16rpx" />
          <view class="dish-info">
            <view class="dish-title">{{ dish.name }}</view>
            <view class="desc">{{ dish.description }}</view>
            <view class="meta">
              <text class="sales">月售 {{ dish.sales }}</text>
              <text class="stock">库存 {{ dish.stock }}</text>
            </view>
            <view class="price-row">
              <text class="price">¥{{ dish.price.toFixed(2) }}</text>
              <view class="counter">
                <view class="btn" @click.stop="removeDish(dish)">
                  <uni-icons type="minus-filled" color="#00C853" size="24"></uni-icons>
                </view>
                <text class="count">{{ getCount(dish.id) }}</text>
                <view class="btn" @click.stop="addDish(dish)">
                  <uni-icons type="plus-filled" color="#00C853" size="24"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="fixed-bottom">
      <view class="cart-info" @click="goCart">
        <uni-badge :text="totalCount" absolute="rightTop" type="success">
          <uni-icons type="cart-filled" color="#00C853" size="28"></uni-icons>
        </uni-badge>
        <view class="total">
          <text class="label">合计</text>
          <text class="money">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
      </view>
      <uv-button
        type="primary"
        shape="circle"
        :disabled="totalCount === 0"
        @click="checkout"
      >
        去结算
      </uv-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { fetchCategories, fetchDishesByCanteen, fetchCanteens } from '../../src/mock/mockData';

const store = useStore();
const canteenId = ref(null);
const canteen = ref(null);
const categoryList = ref([]);
const dishList = ref([]);
const selectedCategoryId = ref(null);

const cartItems = computed(() => store.state.cart.cartItems);
const totalCount = computed(() => store.getters['cart/totalCount']);
const totalPrice = computed(() => store.getters['cart/totalPrice']);

const filteredDishes = computed(() => {
  if (!selectedCategoryId.value) return [];
  return dishList.value.filter((d) => d.categoryId === selectedCategoryId.value);
});

const getCount = (dishId) => {
  const item = cartItems.value.find((c) => c.dishId === dishId);
  return item ? item.count : 0;
};

const addDish = (dish) => {
  store.commit('cart/ADD_TO_CART', {
    dishId: dish.id,
    canteenId: canteenId.value,
    name: dish.name,
    price: dish.price,
    image: dish.image,
  });
};

const removeDish = (dish) => {
  if (getCount(dish.id) === 0) return;
  store.commit('cart/REMOVE_FROM_CART', dish.id);
};

const checkout = () => {
  if (totalCount.value === 0) return;
  const items = cartItems.value.filter((item) => item.canteenId === canteenId.value);
  if (!items.length) return;
  const id = `ORD-${Date.now()}`;
  const totalPriceValue = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );
  const newOrder = {
    id,
    status: 0,
    paid: false,
    payType: null,
    pickupCode: String(Math.floor(100000 + Math.random() * 900000)),
    createTime: Date.now(),
    items: items.map((item) => ({
      dishId: item.dishId,
      count: item.count,
      price: item.price,
      name: item.name,
    })),
    totalPrice: Number(totalPriceValue.toFixed(2)),
    canteenId: canteenId.value,
  };

  const { getOrdersStorage, setOrdersStorage } = require('/src/utils/storage.js');
  const current = getOrdersStorage() || [];
  setOrdersStorage([newOrder, ...current]);

  store.commit('cart/CLEAR_CART', canteenId.value);
  uni.navigateTo({
    url: `/pages/order/detail?id=${id}`,
  });
};

const goCart = () => {
  uni.showToast({ title: '当前为本地购物车', icon: 'none' });
};

onLoad(async (options) => {
  canteenId.value = Number(options?.canteenId || 1);
  const [cats, dishes, canteens] = await Promise.all([
    fetchCategories(canteenId.value),
    fetchDishesByCanteen(canteenId.value),
    fetchCanteens(),
  ]);
  categoryList.value = cats;
  dishList.value = dishes;
  selectedCategoryId.value = cats[0]?.id || null;
  canteen.value = canteens.find((c) => c.id === canteenId.value);
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f6f7f9;
  padding-bottom: 160rpx;
}
.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #e8f5e9;
  border-radius: 24rpx;
  margin: 16rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
}
.sub {
  color: #666;
  margin-top: 6rpx;
}
.rating {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.score {
  color: #ff9800;
  font-weight: 600;
}
.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.sidebar {
  width: 180rpx;
  background: #e8f5e9;
  padding: 12rpx;
}
.sidebar-item {
  padding: 18rpx 12rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  color: #333;
}
.sidebar-item.active {
  background: #fff;
  border-left: 8rpx solid #00c853;
  color: #00c853;
}
.dish-area {
  flex: 1;
  padding: 12rpx;
}
.dish-card {
  display: flex;
  gap: 16rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 16rpx;
  margin-bottom: 14rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
}
.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.dish-title {
  font-size: 30rpx;
  font-weight: 600;
}
.desc {
  color: #666;
  font-size: 24rpx;
}
.meta {
  color: #999;
  display: flex;
  gap: 20rpx;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  color: #ff9800;
  font-size: 32rpx;
  font-weight: 700;
}
.counter {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.count {
  min-width: 32rpx;
  text-align: center;
}
.fixed-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 24rpx;
  background: #fff;
  box-shadow: 0 -4rpx 18rpx rgba(0, 0, 0, 0.05);
}
.cart-info {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.total {
  display: flex;
  flex-direction: column;
}
.label {
  color: #999;
  font-size: 24rpx;
}
.money {
  color: #ff9800;
  font-size: 32rpx;
  font-weight: 700;
}
</style>

