<template>
  <view class="recharge-page">
    <view class="balance-card">
      <view class="label">当前余额</view>
      <view class="amount">¥{{ user?.balance?.toFixed(2) || '0.00' }}</view>
    </view>

    <view class="amount-section">
      <view class="title">选择充值金额</view>
      <view class="amount-list">
        <view
          v-for="amt in amountOptions"
          :key="amt"
          class="amount-item"
          :class="{ active: selectedAmount === amt }"
          @click="selectedAmount = amt"
        >
          ¥{{ amt }}
        </view>
      </view>
      <view class="custom-amount">
        <text class="label">自定义金额</text>
        <input
          v-model="customAmount"
          type="digit"
          placeholder="请输入金额"
          class="input"
          @input="onCustomInput"
        />
      </view>
    </view>

    <view class="payment-section">
      <view class="title">支付方式</view>
      <view class="payment-item">
        <uv-icon name="wallet" color="#00C853" size="24"></uv-icon>
        <text class="text">微信支付</text>
        <view class="radio" :class="{ checked: paymentMethod === 'wechat' }" @click="paymentMethod = 'wechat'">
          <view v-if="paymentMethod === 'wechat'" class="dot"></view>
        </view>
      </view>
      <view class="payment-item">
        <uv-icon name="wallet" color="#00C853" size="24"></uv-icon>
        <text class="text">支付宝</text>
        <view class="radio" :class="{ checked: paymentMethod === 'alipay' }" @click="paymentMethod = 'alipay'">
          <view v-if="paymentMethod === 'alipay'" class="dot"></view>
        </view>
      </view>
    </view>

    <view class="fixed-bottom">
      <view class="total">
        <text class="label">充值金额</text>
        <text class="money">¥{{ finalAmount.toFixed(2) }}</text>
      </view>
      <uv-button
        type="primary"
        shape="circle"
        :disabled="finalAmount <= 0"
        @click="handleRecharge"
      >
        立即充值
      </uv-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const store = useStore();
const user = computed(() => store.state.user);

const amountOptions = [10, 20, 50, 100, 200, 500];
const selectedAmount = ref(0);
const customAmount = ref('');
const paymentMethod = ref('wechat');

const finalAmount = computed(() => {
  if (customAmount.value && Number(customAmount.value) > 0) {
    return Number(customAmount.value);
  }
  return selectedAmount.value;
});

const onCustomInput = () => {
  if (customAmount.value) {
    selectedAmount.value = 0;
  }
};

const handleRecharge = async () => {
  if (finalAmount.value <= 0) {
    uni.showToast({ title: '请选择充值金额', icon: 'none' });
    return;
  }
  uni.showLoading({ title: '充值中...' });
  try {
    const userInfo = uni.getStorageSync('userInfo');
    const newBalance = (Number(user.value?.balance) || 0) + finalAmount.value;
    const res = await proxy.$api.updateUser(userInfo?.id, { balance: newBalance });
    uni.hideLoading();
    if (res?.code === 200) {
      uni.showToast({ title: '充值成功', icon: 'success' });
      await store.dispatch('loadUser');
      setTimeout(() => uni.navigateBack(), 1500);
    } else {
      uni.showToast({ title: res?.msg || '充值失败', icon: 'none' });
    }
  } catch (e) {
    uni.hideLoading();
    uni.showToast({ title: '充值失败', icon: 'none' });
  }
};

onMounted(() => {
  store.dispatch('loadUser');
});
</script>

<style lang="scss" scoped>
.recharge-page {
  min-height: 100vh;
  background: #f6f7f9;
  padding-bottom: 200rpx;
}

.balance-card {
  background: linear-gradient(135deg, #00c853, #3ae59f);
  margin: 24rpx;
  padding: 40rpx;
  border-radius: 24rpx;
  color: #fff;
  text-align: center;
}

.label {
  font-size: 28rpx;
  opacity: 0.9;
}

.amount {
  font-size: 56rpx;
  font-weight: 700;
  margin-top: 16rpx;
}

.amount-section {
  background: #fff;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.amount-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.amount-item {
  flex: 0 0 calc(33.333% - 12rpx);
  padding: 24rpx;
  text-align: center;
  background: #f6f7f9;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid transparent;
}

.amount-item.active {
  background: #e8f5e9;
  border-color: #00c853;
  color: #00c853;
  font-weight: 700;
}

.custom-amount {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.custom-amount .label {
  font-size: 28rpx;
  color: #666;
}

.input {
  flex: 1;
  padding: 20rpx 24rpx;
  background: #f6f7f9;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.payment-section {
  background: #fff;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.payment-item:last-child {
  border-bottom: none;
}

.text {
  flex: 1;
  font-size: 28rpx;
}

.radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio.checked {
  border-color: #00c853;
}

.dot {
  width: 24rpx;
  height: 24rpx;
  background: #00c853;
  border-radius: 50%;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.total {
  flex: 1;
}

.total .label {
  font-size: 24rpx;
  color: #666;
}

.total .money {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #ff9800;
  margin-top: 4rpx;
}
</style>