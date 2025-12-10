<template>
  <view class="edit-page">
    <view class="form-card">
      <view class="form-item">
        <text class="label">菜品名称</text>
        <input v-model="form.name" type="text" placeholder="请输入菜品名称" class="input" />
      </view>

      <view class="form-item">
        <text class="label">所属分类</text>
        <picker
          mode="selector"
          :range="categoryOptions"
          range-key="name"
          :value="categoryIndex"
          @change="onCategoryChange"
        >
          <view class="picker">
            {{ form.categoryId ? categoryOptions.find((c) => c.id === form.categoryId)?.name : '请选择分类' }}
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">价格 (¥)</text>
        <input v-model="form.price" type="digit" placeholder="请输入价格" class="input" />
      </view>

      <view class="form-item">
        <text class="label">库存</text>
        <input v-model="form.stock" type="number" placeholder="请输入库存" class="input" />
      </view>

      <view class="form-item">
        <text class="label">菜品描述</text>
        <textarea
          v-model="form.description"
          placeholder="请输入菜品描述"
          class="textarea"
          maxlength="100"
        />
      </view>

      <view class="form-item">
        <text class="label">菜品图片</text>
        <view class="image-upload">
          <uv-image
            v-if="form.image"
            :src="form.image"
            width="200rpx"
            height="200rpx"
            radius="16rpx"
            mode="aspectFill"
          />
          <view v-else class="upload-placeholder" @click="chooseImage">
            <uv-icon name="camera" size="40" color="#ccc"></uv-icon>
            <text>点击上传</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="switch-row">
          <text class="label">上架状态</text>
          <switch :checked="form.onShelf" @change="onShelfChange" color="#00C853" />
        </view>
      </view>
    </view>

    <view class="fixed-bottom">
      <uv-button type="primary" shape="circle" @click="handleSave">保存</uv-button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { fetchCategories, fetchDishDetail, saveDish, createDish } from '/src/mock/mockData';

const dishId = ref(null);
const categoryOptions = ref([]);
const categoryIndex = ref(0);

const form = ref({
  name: '',
  categoryId: null,
  price: '',
  stock: '',
  description: '',
  image: '',
  onShelf: true,
});

const onCategoryChange = (e) => {
  const index = Number(e.detail.value);
  categoryIndex.value = index;
  form.value.categoryId = categoryOptions.value[index].id;
};

const onShelfChange = (e) => {
  form.value.onShelf = e.detail.value;
};

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value.image = res.tempFilePaths[0];
    },
  });
};

const handleSave = async () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入菜品名称', icon: 'none' });
    return;
  }
  if (!form.value.categoryId) {
    uni.showToast({ title: '请选择分类', icon: 'none' });
    return;
  }
  if (!form.value.price || Number(form.value.price) <= 0) {
    uni.showToast({ title: '请输入有效价格', icon: 'none' });
    return;
  }
  if (!form.value.stock || Number(form.value.stock) < 0) {
    uni.showToast({ title: '请输入有效库存', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '保存中...' });
  try {
    const data = {
      ...form.value,
      price: Number(form.value.price),
      stock: Number(form.value.stock),
    };

    let result;
    if (dishId.value) {
      result = await saveDish(dishId.value, data);
    } else {
      result = await createDish(data);
    }

    uni.hideLoading();
    if (result.success) {
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({ title: result.message || '保存失败', icon: 'none' });
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '保存失败', icon: 'none' });
  }
};

onLoad(async (options) => {
  if (options.id) {
    dishId.value = Number(options.id);
    const dish = await fetchDishDetail(dishId.value);
    if (dish) {
      form.value = {
        name: dish.name,
        categoryId: dish.categoryId,
        price: String(dish.price),
        stock: String(dish.stock),
        description: dish.description || '',
        image: dish.image || '',
        onShelf: dish.onShelf !== false,
      };
      const catIndex = categoryOptions.value.findIndex((c) => c.id === dish.categoryId);
      if (catIndex >= 0) categoryIndex.value = catIndex;
    }
  }

  // 加载所有分类
  const categories = await fetchCategories();
  categoryOptions.value = categories;
});
</script>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background: #f6f7f9;
  padding-bottom: 160rpx;
}

.form-card {
  background: #fff;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  color: #333;
}

.input {
  width: 100%;
  padding: 20rpx 24rpx;
  background: #f6f7f9;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.picker {
  padding: 20rpx 24rpx;
  background: #f6f7f9;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 20rpx 24rpx;
  background: #f6f7f9;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.image-upload {
  margin-top: 16rpx;
}

.upload-placeholder {
  width: 200rpx;
  height: 200rpx;
  background: #f6f7f9;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  color: #ccc;
  font-size: 24rpx;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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