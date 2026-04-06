<template>
  <view class="order-page">
    <uv-tabs
      :list="tabList"
      :current="currentTab"
      lineColor="#00C853"
      activeStyle="color:#00C853;font-weight:600;"
      @change="onTabChange"
    />  

    <view class="orders">
      <view v-for="order in orders" :key="order.id" class="order-card" @click="goToDetail(order.id)">
        <view class="card-header">
          <text class="order-id">#{{ order.id }}</text>
          <text :class="['status', statusClass(order.status)]">{{ statusText(order.status) }}</text>
        </view>
        <view class="canteen-name">{{ order.canteen?.name }}</view>
        <view class="items">
          <view v-for="item in order.items" :key="item.dishId" class="item">
            <text class="name">{{ item.name }}</text>
            <text class="count">x{{ item.quantity }}</text>
            <text class="price">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
          </view>
        </view>
        <view class="footer">
          <view class="total">合计：¥{{ order.totalPrice.toFixed(2) }}</view>
          <uv-button
            v-if="order.status === 0 && userInfo?.role !== 'admin'"
            size="mini"
            type="error"
            shape="circle"
            @click.stop="confirmCancel(order.id)"
          >
            取消订单
          </uv-button>
        </view>
      </view>
    </view>

    <uv-modal
      ref="modal"
      title="确认取消" showCancelButton
      content="确认要取消该订单吗？"
      @confirm="handleCancel"
      @cancel="cancel"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const tabList = [
  { name: '全部', value: -1 },
  { name: '待取餐', value: 0 },
  { name: '已完成', value: 1 },
  { name: '已取消', value: 2 },
];
const userInfo = ref(uni.getStorageSync('userInfo'));
const modal = ref(null);
const currentTab = ref(0);
const orders = ref([]);
const pendingOrderId = ref(null);

const loadOrders = async () => {
  const res = await proxy.$api.getOrders();
  const all = (res?.code === 200 && Array.isArray(res.data)) ? res.data : [];
  const status = tabList[currentTab.value].value;
  orders.value = status === -1 ? all : all.filter((o) => o.status === status);
};

const onTabChange = ({ index }) => {
  currentTab.value = index;
  loadOrders();
};

const statusText = (status) => ({ pending: '待取餐', completed: '已完成', canceled: '已取消' })[status] || '未知';
const statusClass = (status) => ({ pending: 'pending', completed: 'success', canceled: 'cancel' })[status] || '';

const confirmCancel = (orderId) => {
  pendingOrderId.value = orderId;
  modal.value.open();
};
const goToDetail = (orderId) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${orderId}`
  });
};
const handleCancel = async () => {
  if (!pendingOrderId.value) return;
  await proxy.$api.updateOrder(pendingOrderId.value, { status: 'canceled' });
  uni.showToast({ title: '取消成功', icon: 'success' });
  modal.value.close();
  pendingOrderId.value = null;
  loadOrders();
};
const cancel = () => {
  modal.value.close();
  pendingOrderId.value = null;
};
onMounted(loadOrders);
</script>

<style lang="scss" scoped>
.order-page {
  background: #f6f7f9;
  min-height: 100vh;
}
.orders {
  padding: 16rpx;
}
.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-id {
  font-weight: 600;
}
.status {
  font-size: 26rpx;
}
.status.pending {
  color: #ff9800;
}
.status.success {
  color: #00c853;
}
.status.cancel {
  color: #b0bec5;
}
.canteen-name {
  color: #666;
  margin: 8rpx 0;
}
.items {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 12rpx;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rpx 0;
  .name {
    flex: 1;
  }
  .count {
    color: #777;
    margin: 0 12rpx;
  }
  .price {
    color: #ff9800;
    font-weight: 600;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}
.total {
  font-size: 30rpx;
  font-weight: 700;
  color: #ff9800;
}
</style>