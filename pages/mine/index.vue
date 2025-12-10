<template>
  <view class="mine-page">
    <view class="header">
      <uv-avatar :src="user?.avatar" size="70" />
      <view class="info">
        <view class="name">{{ user?.name || '未登录' }}</view>
        <view class="id">学号：{{ user?.studentId }}</view>
      </view>
      <view class="balance">
        <text class="label">余额</text>
        <text class="money">¥{{ user?.balance?.toFixed(2) }}</text>
      </view>
    </view>

    <uv-cell-group :border="false">
      <uv-cell title="我的订单" isLink url="/pages/order/list" />
      <uv-cell title="账户充值" isLink @click="goRecharge" />
      <uv-cell v-if="userInfo?.role === 'admin'" title="食堂管理端" isLink @click="goAdmin" />
      <uv-cell title="关于我们" isLink @click="aboutUs"/>
      <uv-cell v-if="userInfo" title="退出登录" isLink @click="logout" />
    </uv-cell-group>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.state.user);
const userInfo = ref(uni.getStorageSync('userInfo'));

const goRecharge = () => {
  uni.navigateTo({ url: '/pages/recharge/index' });
};

const goAdmin = () => {
  uni.navigateTo({ url: '/pages/admin/dish-list' });
};
const aboutUs = () => {
  uni.navigateTo({ url: '/pages/aboutUs/index' });
};

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        // 清除用户信息
        uni.removeStorageSync('userInfo');
        userInfo.value = null;
        
        // 跳转到登录页面
        uni.redirectTo({
          url: '/pages/account/login'
        });
      }
    }
  });
};

onMounted(() => {
  store.dispatch('loadUser');
});
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f6f7f9;
}
.header {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  background: linear-gradient(135deg, #00c853, #3ae59f);
  color: #fff;
}
.info {
  flex: 1;
  margin-left: 20rpx;
}
.name {
  font-size: 32rpx;
  font-weight: 700;
}
.id {
  margin-top: 6rpx;
  color: #e8f5e9;
}
.balance {
  text-align: right;
}
.label {
  font-size: 24rpx;
}
.money {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}
</style>

