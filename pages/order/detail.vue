<template>
  <view class="order-detail">
    <view class="order-header">
      <view class="status-section">
        <text :class="['status-text', statusClass(order.status)]">{{ statusText(order.status) }}</text>
        <text class="order-id">订单编号：{{ order.id }}</text>
      </view>
      
      <view class="canteen-info">
        <text class="canteen-name">{{ order.canteen?.name }}</text>
        <text class="order-time">下单时间：{{ formatTime(order.createTime) }}</text>
      </view>
    </view>
    
    <view class="pickup-card" v-if="order.pickupCode">
      <view class="pickup-title">取餐码</view>
      <view class="pickup-code">{{ order.pickupCode }}</view>
      <text class="pickup-tip">请在取餐窗口出示取餐码</text>
    </view>
    
    <view class="order-items">
      <view class="section-title">订单菜品</view>
      <view class="item" v-for="item in order.items" :key="item.dishId">
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">¥{{ item.price }}</text>
        </view>
        <view class="item-count">
          <text>数量：{{ item.quantity }}</text>
          <text class="item-total">小计：¥{{ (item.price * item.quantity).toFixed(2) }}</text>
        </view>
      </view>
    </view>
    
    <view class="order-summary">
      <view class="summary-item">
        <text>菜品总计</text>
        <text>¥{{ calculateSubtotal().toFixed(2) }}</text>
      </view>
      <view class="summary-item">
        <text>配送费</text>
        <text>¥0.00</text>
      </view>
      <view class="summary-item total">
        <text>实付金额</text>
        <text class="amount">¥{{ order.totalPrice.toFixed(2) }}</text>
      </view>
    </view>
    
    <view class="order-actions" v-if="userInfo?.role !== 'admin'">
      <uv-button
        v-if="!order.paid"
        type="primary"
        shape="circle"
        @click="handlePay"
      >
        去支付
      </uv-button>
      <uv-button
        v-if="order.status === 0"
        type="error"
        shape="circle"
        @click="confirmCancel"
      >
        取消订单
      </uv-button>
    </view>
    
    <uv-modal
      ref="modal"
      title="确认取消"
      showCancelButton
      content="确认要取消该订单吗？"
      @confirm="handleCancel"
      @cancel="cancel"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const order = ref({
  id: '',
  status: 0,
  items: [],
  totalPrice: 0,
  canteen: {},
  createTime: Date.now(),
  paid: false,
  payType: null,
  pickupCode: '',
});

const modal = ref(null);
const pendingOrderId = ref(null);
const userInfo = ref(uni.getStorageSync('userInfo'));
// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 订单状态文本
const statusText = (status) => ['待取餐', '已完成', '已取消'][status] || '未知';
// 订单状态样式类
const statusClass = (status) => ['pending', 'success', 'cancel'][status] || '';

// 计算菜品小计
const calculateSubtotal = () => {
  return order.value.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
};

// 支付订单
const handlePay = async () => {
  if (!order.value.id || order.value.paid) return;
  try {
    uni.showLoading({ title: '支付中...' });
    const res = await proxy.$api.updateOrder({ id: order.value.id, paid: true, payType: '校园卡', status: 'pending' });
    uni.hideLoading();
    if (res?.code === 200) {
      order.value.paid = true;
      order.value.payType = '校园卡';
      uni.showToast({ title: '支付成功', icon: 'success' });
    } else {
      uni.showToast({ title: '支付失败', icon: 'none' });
    }
  } catch (e) {
    uni.hideLoading();
    uni.showToast({ title: '支付失败', icon: 'none' });
  }
};

// 确认取消订单
const confirmCancel = () => {
  pendingOrderId.value = order.value.id;
  modal.value.open();
};

// 处理取消订单
const handleCancel = async () => {
  if (!pendingOrderId.value) return;
  await proxy.$api.updateOrder({ id: pendingOrderId.value, status: 'canceled' });
  uni.showToast({ title: '取消成功', icon: 'success' });
  modal.value.close();
  pendingOrderId.value = null;
  order.value.status = 2;
};

// 取消操作
const cancel = () => {
  modal.value.close();
  pendingOrderId.value = null;
};

// 页面加载时获取订单详情
onLoad(async (options) => {
  if (options.id) {
    try {
      const res = await proxy.$api.getOrderById({ id: options.id });
      if (res?.code === 200 && res?.data) {
        order.value = { ...order.value, ...res.data };
      }
    } catch (e) {
      uni.showToast({ title: '获取订单详情失败', icon: 'none' });
    }
  }
});
</script>

<style lang="scss" scoped>
.order-detail {
  background: #f6f7f9;
  min-height: 100vh;
  padding: 20rpx;
}

.order-header {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
}

.status-text.pending {
  color: #ff9800;
}

.status-text.success {
  color: #00c853;
}

.status-text.cancel {
  color: #b0bec5;
}

.order-id {
  color: #999;
  font-size: 28rpx;
}

.canteen-info {
  display: flex;
  flex-direction: column;
}

.canteen-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.order-time {
  color: #999;
  font-size: 26rpx;
}

.pickup-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
  text-align: center;
}

.pickup-title {
  font-size: 28rpx;
  color: #666;
}

.pickup-code {
  margin-top: 16rpx;
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 8rpx;
  color: #00c853;
}

.pickup-tip {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin: 20rpx 0;
  padding-left: 10rpx;
  border-left: 8rpx solid #00C853;
}

.order-items {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}

.item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: bold;
}

.item-price {
  color: #ff9800;
  font-weight: bold;
}

.item-count {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 26rpx;
}

.item-total {
  color: #ff9800;
  font-weight: bold;
}

.order-summary {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  font-size: 28rpx;
}

.summary-item.total {
  border-top: 1rpx solid #f0f0f0;
  margin-top: 10rpx;
  padding-top: 20rpx;
}

.amount {
  color: #ff9800;
  font-size: 32rpx;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
}
</style>