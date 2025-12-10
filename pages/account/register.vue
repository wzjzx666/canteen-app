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

const formRef = ref(null);
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
  
  // 模拟注册请求
  setTimeout(() => {
    loading.value = false;
    
    // 保存用户信息到本地存储
    const userInfo = {
      username: form.name,
      userId: form.id,
      role: form.role,
      registerTime: new Date().getTime()
    };
    
    uni.setStorageSync('userInfo', userInfo);
    
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    });
    
    // 注册成功后跳转到登录页面
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/account/login'
      });
    }, 1000);
  }, 800);
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