<template>
  <view class="register-page">
    <view class="header">
      <text class="title">用户注册</text>
      <text class="subtitle">欢迎加入智慧食堂</text>
    </view>
    
    <view class="form-container">
      <uv-form :model="form" ref="formRef">
        <uv-form-item label="姓名" prop="name">
          <uv-input 
            v-model="form.name" 
            placeholder="请输入真实姓名" 
            border="surround"
          />
        </uv-form-item>
        
        <uv-form-item label="学号/工号" prop="id">
          <uv-input 
            v-model="form.id" 
            placeholder="请输入学号或工号" 
            border="surround"
          />
        </uv-form-item>
        
        <uv-form-item label="密码" prop="password">
          <uv-input 
            v-model="form.password" 
            type="password"
            placeholder="请输入密码" 
            border="surround"
          />
        </uv-form-item>
        
        <uv-form-item label="确认密码" prop="confirmPassword">
          <uv-input 
            v-model="form.confirmPassword" 
            type="password"
            placeholder="请再次输入密码" 
            border="surround"
          />
        </uv-form-item>
        
        <uv-form-item label="角色" prop="role">
          <uv-radio-group v-model="form.role" placement="row">
            <uv-radio label="学生" name="student" />
            <uv-radio label="教师" name="teacher" />
            <uv-radio label="管理员" name="admin" />
          </uv-radio-group>
        </uv-form-item>
        
        <uv-button 
          type="success" 
          shape="circle" 
          @click="handleRegister"
          :loading="loading"
        >
          注册
        </uv-button>
      </uv-form>
      
      <view class="actions">
        <text @click="goToLogin">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import md5 from 'js-md5';
import { getLocalAccounts, setLocalAccounts } from '../../src/utils/storage';
import { apiPost } from '/src/services/apiClient';

const loading = ref(false);

const form = reactive({
  name: '',
  id: '',
  password: '',
  confirmPassword: '',
  role: 'student' // 默认角色为学生
});

const handleRegister = async () => {
  if (!form.name || !form.id || !form.password) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  
  if (form.password !== form.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  loading.value = true;

  const useReal = uni.getStorageSync('use_real_api') !== false;
  try {
    if (useReal) {
      const res = await apiPost('/api/auth/register', {
        username: form.id,
        password: form.password,
        role: form.role,
      });
      if (res?.success) {
        uni.showToast({
          title: '注册成功',
          icon: 'success',
        });
        uni.redirectTo({
          url: '/pages/account/login',
        });
        return;
      }
    }
  } catch (e) {
    // fallback 到本地注册
  }

  const localAccounts = getLocalAccounts() || [];
  const exists = localAccounts.some(
    (item) => item.username === form.id && item.role === form.role,
  );
  if (exists) {
    loading.value = false;
    uni.showToast({
      title: '该账号已注册',
      icon: 'none',
    });
    return;
  }

  const newAccount = {
    id: Date.now(),
    username: form.id,
    passwordHash: md5(form.password),
    role: form.role,
    nickname: form.name,
    avatar: '',
    balance: 0,
    studentId: form.id,
  };

  setLocalAccounts([newAccount, ...localAccounts]);
  loading.value = false;

  uni.showToast({
    title: '注册成功',
    icon: 'success',
  });

  uni.redirectTo({
    url: '/pages/account/login',
  });
};

const goToLogin = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #00c853, #3ae59f);
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-top: 80rpx;
  margin-bottom: 60rpx;
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
</style>