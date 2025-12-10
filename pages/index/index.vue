<template>
  <view class="index-page">
    <uv-navbar
      :placeholder="true"
      :fixed="true"
      title="智慧食堂"
      bgColor="#00C853"
      titleStyle="color:#fff;font-weight:600;"
    >
    <template #left>{{  }}</template>
    <template #center>
      <view class="navbar-title">智慧食堂</view>
    </template>
      <template #right>
        <view class="location" @click="onLocate">
          <uni-icons type="location-filled" color="#fff" size="20"></uni-icons>
          <text class="location__text">{{ location }}</text>
        </view>
      </template>
    </uv-navbar>

    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" color="#9e9e9e" size="18"></uni-icons>
        <input v-model="searchKeyword" placeholder="搜索菜品或食堂" />
      </view>
      <uv-button type="primary" size="small" shape="circle" @click="goSearch">
        搜索
      </uv-button>
    </view>

    <view class="card banner-card">
      <uv-swiper
        :list="bannerList"
        indicator
        indicatorMode="line"
        height="360rpx"
        bgColor="#E8F5E9"
        borderRadius="20rpx"
        keyName="image"
        :autoplay="true"
        circular
      ></uv-swiper>
    </view>

    <view class="card notice-card">
      <uv-notice-bar
        :text="notices.join(' ')"
        mode="horizontal"
        color="#00C853"
        bgColor="#E8F5E9"
        :volumeIcon="true"
        :moreIcon="false"
      ></uv-notice-bar>
    </view>

    <view class="section">
      <view class="section__title">热门食堂</view>
      <view class="canteen-list">
        <view
          v-for="item in filteredCanteens"
          :key="item.id"
          class="canteen-card"
          @click="goCanteen(item)"
        >
          <uv-image :src="item.image" width="220rpx" height="220rpx" radius="20rpx" />
          <view class="canteen-info">
            <view class="title">{{ item.name }}</view>
            <view class="location-line">
              <uni-icons type="location-filled" color="#00C853" size="18"></uni-icons>
              <text class="location-text">{{ item.location }}</text>
            </view>
            <view class="rating">
              <uv-rate :count="5" :value="item.rating" activeColor="#FF9800" readonly />
              <text class="rating-score">{{ item.rating }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchCanteens, fetchDishesByCanteen } from '/src/mock/mockData';

const location = ref('校园内');
const searchKeyword = ref('');
const canteenList = ref([]);
const bannerList = ref([
  {
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=1200&q=60',
    title: '每日推荐',
  },
]);
const notices = ref(['今日特供：红烧肉盖饭限时 8 折', '新品上架：孜然羊肉串', '充值满 100 送 10 元']);

// 获取用户信息
const userInfo = uni.getStorageSync('userInfo');

const filteredCanteens = computed(() => {
  if (!searchKeyword.value) return canteenList.value;
  return canteenList.value.filter((c) =>
    c.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  );
});

const buildBanner = async (canteenId) => {
  const dishes = await fetchDishesByCanteen(canteenId);
  bannerList.value = dishes.slice(0, 4).map((d) => ({
    image: d.image,
    title: d.name,
  }));
};


const loadCanteens = async () => {
  const list = await fetchCanteens();
  canteenList.value = list;
  buildBanner(list[0]?.id || 1);
};

const goCanteen = (canteen) => {
  uni.navigateTo({
    url: `/pages/canteen/detail?canteenId=${canteen.id}`,
  });
};

const goSearch = () => {
  if (filteredCanteens.value.length > 0) {
    uni.navigateTo({
      url: `/pages/search/result?keyword=${searchKeyword.value}`,
    });
  } else {
    uni.showToast({ title: '暂无匹配食堂', icon: 'none' });
  }
};


const onLocate = async () => {
  try {
    const res = await uni.getLocation();
    location.value = `经度: ${res.longitude}, 纬度: ${res.latitude}`;
  } catch (error) {
    uni.showToast({ title: '定位失败', icon: 'none' });
  }
};


onMounted(() => {
  // 检查用户是否已登录
  const userInfo = uni.getStorageSync('userInfo');
  if (!userInfo) {
    // 如果未登录，跳转到登录页面
    uni.redirectTo({
      url: '/pages/account/login'
    });
    return;
  }
  
  loadCanteens();
});
</script>

<style lang="scss" scoped>
.index-page {
  padding: 0 24rpx 40rpx;
  background: #f6f7f9;
}
.location {
  padding-top: 60rpx;
  display: flex;
  align-items: center;
  color: #fff;
  &__text {
    margin-left: 6rpx;
    font-size: 26rpx;
  }
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 6rpx 12rpx;
  margin-top: 60rpx;
}
.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12rpx 18rpx;
  border-radius: 50rpx;
  input {
    flex: 1;
    margin-left: 12rpx;
    font-size: 28rpx;
  }
}
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 20rpx;
}
.banner-card {
  padding: 0;
  overflow: hidden;
}
.notice-card {
  background: #e8f5e9;
}
.section {
  margin-top: 12rpx;
  &__title {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
  }
}
.canteen-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.canteen-card {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  padding: 18rpx;
  gap: 18rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}
.canteen-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    font-size: 32rpx;
    font-weight: 700;
    color: #111;
  }
  .location-line {
    display: flex;
    align-items: center;
    margin: 8rpx 0;
  }
  .location-text {
    color: #666;
    margin-left: 8rpx;
    font-size: 26rpx;
  }
  .rating {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
  .rating-score {
    color: #ff9800;
    font-weight: 600;
  }
}
.navbar-title{
  padding-top: 60rpx;
  color: #fff;
  font-size: 15px;
}
:deep(.uv-navbar__content){
  height:140rpx!important;
}
</style>
