<template>
  <view class="page">
    <uv-image :src="dish?.image" width="100%" height="360rpx" mode="aspectFill" />
    <view class="card">
      <view class="title">{{ dish?.name }}</view>
      <view class="meta">
        <text>月售 {{ dish?.sales }}</text>
        <text>库存 {{ dish?.stock }}</text>
      </view>
      <view class="price">¥{{ dish?.price?.toFixed(2) }}</view>
      <view class="desc">{{ dish?.description }}</view>
    </view>

    <view class="footer">
      <uv-button type="primary" plain shape="circle" @click="addToCart">加入购物车</uv-button>
      <uv-button type="primary" shape="circle" @click="buyNow">立即购买</uv-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { fetchDishDetail } from '../../src/mock/mockData';

const dish = ref(null);
const store = useStore();
const canteenId = ref(null);

const addToCart = () => {
  if (!dish.value) return;
  store.commit('cart/ADD_TO_CART', {
    dishId: dish.value.id,
    canteenId: canteenId.value,
    name: dish.value.name,
    price: dish.value.price,
    image: dish.value.image,
  });
  uni.showToast({ title: '已加入购物车', icon: 'success' });
};

const buyNow = () => {
  addToCart();
  uni.showToast({ title: '下单成功（模拟）', icon: 'success' });
};

onLoad(async (options) => {
  const id = Number(options?.id);
  canteenId.value = Number(options?.canteenId || 1);
  dish.value = await fetchDishDetail(id);
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f7f9;
}
.card {
  margin: -40rpx 24rpx 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 10rpx 26rpx rgba(0, 0, 0, 0.06);
}
.title {
  font-size: 34rpx;
  font-weight: 700;
}
.meta {
  display: flex;
  gap: 20rpx;
  color: #777;
  margin: 10rpx 0;
}
.price {
  color: #ff9800;
  font-size: 36rpx;
  font-weight: 700;
  margin: 10rpx 0;
}
.desc {
  color: #555;
  line-height: 1.6;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  padding: 20rpx 24rpx calc(env(safe-area-inset-bottom) + 20rpx);
  background: #fff;
  box-shadow: 0 -6rpx 18rpx rgba(0, 0, 0, 0.05);
}
</style>

