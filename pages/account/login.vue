<template>
  <view class="login-page">
    <view class="header">
      <text class="title">智慧食堂</text>
      <text class="subtitle">欢迎使用校园订餐系统</text>
    </view>
    
    <view class="form-container">
      <uv-form :model="form" ref="formRef">
        <uv-form-item label="用户名" prop="username">
          <uv-input 
            v-model="form.username" 
            placeholder="请输入学号/工号" 
            border="surround"
          />
        </uv-form-item>
        
        <uv-form-item label="密码" prop="password">
          <uv-input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码" 
            border="surround"
          >
            <template #suffix>
              <uv-icon
                :name="showPassword ? 'eye-fill' : 'eye-off'"
                size="24"
                color="#8c8c8c"
                @tap="togglePasswordVisibility"
              />
            </template>
          </uv-input>
        </uv-form-item>
        
        <uv-form-item label="角色" prop="role">
          <uv-radio-group v-model="form.role" placement="column">
            <uv-radio label="学生" name="student" />
            <uv-radio label="教师" name="teacher" />
            <uv-radio label="管理员" name="admin" />
          </uv-radio-group>
        </uv-form-item>
        
        <uv-button 
          type="success" 
          shape="circle" 
          @click="handleLogin"
          :loading="loading"
        >
          登录
        </uv-button>
      </uv-form>
      
      <view class="actions">
        <text @click="goToRegister">还没有账号？立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import md5 from 'js-md5';
import { mockLogin } from '/src/mock/mockAuth';
const formRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);
const form = reactive({
  username: '',
  password: '',
  role: 'student' // 默认角色为学生
});

const handleLogin = async () => {
  if (!form.username || !form.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    });
    return;
  }

  loading.value = true;
  try {
    const res = await mockLogin({
      username: form.username.trim(),
      password: md5((form.password).trim()),
      role: form.role
    });
    if (res.code === 200 && res.data) {
      uni.setStorageSync('token', res.data.token);
      uni.setStorageSync('userInfo', res.data.user);
      uni.showToast({
        title: res.msg || '登录成功',
        icon: 'success'
      });
      uni.reLaunch({
        url: '/pages/index/index'
      });
    } else {
      uni.showToast({
        title: res.error || '登录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: '登录异常，请稍后重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/account/register'
  });
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style lang="scss" scoped>
.login-page {
  height: 90vh;
  background: linear-gradient(135deg, #00c853, #3ae59f);
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-top: 120rpx;
  margin-bottom: 80rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #e8f5e9;
}

.form-container {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  flex: 1;
}

.actions {
  text-align: center;
  margin-top: 30rpx;
  
  text {
    color: #00c853;
    font-size: 28rpx;
  }
}
:deep(.uv-radio){
  margin-bottom: 10rpx;
}
</style>
