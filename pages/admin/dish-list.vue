<template>
  <view class="admin-page">
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: selectedCanteen === 0 }" @click="selectedCanteen = 0">
        全部
      </view>
      <view
        v-for="c in canteens"
        :key="c.id"
        class="filter-item"
        :class="{ active: selectedCanteen === c.id }"
        @click="selectedCanteen = c.id"
      >
        {{ c.name }}
      </view>
    </view>

    <view class="dish-list">
      <view v-for="dish in filteredDishes" :key="dish.id" class="dish-card">
        <uv-image :src="dish.image" width="160rpx" height="160rpx" radius="16rpx" />
        <view class="dish-info">
          <view class="dish-header">
            <view class="dish-title">{{ dish.name }}</view>
            <view class="shelf-status" :class="{ on: dish.onShelf, off: !dish.onShelf }">
              {{ dish.onShelf ? '已上架' : '已下架' }}
            </view>
          </view>
          <view class="dish-desc">{{ dish.description }}</view>
          <view class="dish-meta">
            <text class="price">¥{{ dish.price.toFixed(2) }}</text>
            <text class="stock">库存: {{ dish.stock }}</text>
            <text class="sales">月售: {{ dish.sales }}</text>
          </view>
        </view>
        <view class="dish-actions">
          <uv-button
            :type="dish.onShelf ? 'warning' : 'success'"
            size="mini"
            shape="circle"
            @click="toggleShelf(dish)"
          >
            {{ dish.onShelf ? '下架' : '上架' }}
          </uv-button>
          <uv-button
            type="primary"
            size="mini"
            shape="circle"
            @click="editDish(dish)"
            style="margin-top: 12rpx;"
          >
            编辑
          </uv-button>
        </view>
      </view>
    </view>

    <view class="fixed-bottom">
      <uv-button type="primary" shape="circle" @click="addDish">添加菜品</uv-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchCanteens, fetchAllDishes, fetchCategories, toggleDishShelf } from '/src/mock/mockData';

const canteens = ref([]);
const dishes = ref([]);
const categories = ref([]);
const selectedCanteen = ref(0);

const filteredDishes = computed(() => {
  if (selectedCanteen.value === 0) return dishes.value;
  // 根据食堂ID过滤（需要通过分类关联）
  const canteenCategoryIds = categories.value
    .filter((cat) => cat.canteenId === selectedCanteen.value)
    .map((cat) => cat.id);
  return dishes.value.filter((d) => canteenCategoryIds.includes(d.categoryId));
});

const toggleShelf = async (dish) => {
  uni.showLoading({ title: '处理中...' });
  try {
    const result = await toggleDishShelf(dish.id);
    uni.hideLoading();
    if (result.success) {
      dish.onShelf = result.onShelf;
      uni.showToast({ title: result.onShelf ? '已上架' : '已下架', icon: 'success' });
    } else {
      uni.showToast({ title: '操作失败', icon: 'none' });
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '操作失败', icon: 'none' });
  }
};

const editDish = (dish) => {
  uni.navigateTo({
    url: `/pages/admin/dish-edit?id=${dish.id}`,
  });
};

const addDish = () => {
  uni.navigateTo({
    url: '/pages/admin/dish-edit',
  });
};

onMounted(async () => {
  const [canteensData, dishesData, categoriesData] = await Promise.all([
    fetchCanteens(),
    fetchAllDishes(),
    fetchCategories(),
  ]);
  canteens.value = canteensData;
  dishes.value = dishesData;
  categories.value = categoriesData;
});
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #f6f7f9;
  padding-bottom: 160rpx;
}

.filter-bar {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background: #fff;
  overflow-x: auto;
}

.filter-item {
  padding: 12rpx 24rpx;
  background: #f6f7f9;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
}

.filter-item.active {
  background: #00c853;
  color: #fff;
}

.dish-list {
  padding: 0 24rpx;
}

.dish-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  padding: 24rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
}

.dish-info {
  flex: 1;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.dish-title {
  font-size: 32rpx;
  font-weight: 700;
}

.shelf-status {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.shelf-status.on {
  background: #e8f5e9;
  color: #00c853;
}

.shelf-status.off {
  background: #ffebee;
  color: #f44336;
}

.dish-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.dish-meta {
  display: flex;
  gap: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.price {
  color: #ff9800;
  font-weight: 700;
  font-size: 28rpx;
}

.dish-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}
</style>

