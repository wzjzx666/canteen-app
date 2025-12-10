<template>
  <view class="about-us">

    <!-- 学校信息 -->
    <view class="about-us__section">
      <view class="about-us__section-title">
        <uv-icon name="info-circle" size="18" color="#333"></uv-icon>
        <text class="about-us__section-text">学校信息</text>
      </view>
      <view class="about-us__content">
        <text class="about-us__desc">智慧食堂是为本校师生提供便捷用餐服务的智能平台，致力于提升校园餐饮体验。</text>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="about-us__section">
      <view class="about-us__section-title">
        <uv-icon name="email" size="18" color="#333"></uv-icon>
        <text class="about-us__section-text">联系我们</text>
      </view>
      <view class="about-us__contact-info">
        <view class="about-us__contact-item about-us__contact-item--clickable" @tap="callPhone">
          <uv-icon name="phone" size="16" color="#666"></uv-icon>
          <text class="about-us__contact-text">{{ contactInfo.phone }}</text>
          <uv-icon name="arrow-right" size="14" color="#ccc" class="about-us__contact-arrow"></uv-icon>
        </view>
        <view class="about-us__contact-item about-us__contact-item--clickable" @tap="copyEmail">
          <uv-icon name="email" size="16" color="#666"></uv-icon>
          <text class="about-us__contact-text">{{ contactInfo.email }}</text>
          <uv-icon name="attach" size="14" color="#ccc" class="about-us__contact-arrow"></uv-icon>
        </view>
        <view class="about-us__contact-item">
          <uv-icon name="map" size="16" color="#666"></uv-icon>
          <text class="about-us__contact-text">{{ contactInfo.address }}</text>
        </view>
        <view class="about-us__contact-item">
          <uv-icon name="clock" size="16" color="#666"></uv-icon>
          <text class="about-us__contact-text">{{ contactInfo.workTime }}</text>
        </view>
      </view>
    </view>

    <!-- 意见建议 -->
    <view class="about-us__section">
      <view class="about-us__section-title">
        <uv-icon name="edit-pen" size="18" color="#333"></uv-icon>
        <text class="about-us__section-text">意见建议</text>
      </view>
      <view class="about-us__feedback-form">
        <textarea 
          v-model="feedbackContent" 
          placeholder="请输入您的宝贵意见或建议..." 
          class="about-us__feedback-input"
        />
        <uv-button type="primary" @tap="submitFeedback">提交建议</uv-button>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="about-us__section">
      <view class="about-us__section-title">
        <uv-icon name="setting" size="18" color="#333"></uv-icon>
        <text class="about-us__section-text">版本信息</text>
      </view>
      <view class="about-us__version-info">
        <text class="about-us__version-text">智慧食堂 v{{ version }}</text>
        <text class="about-us__copyright">© 2023 {{ schoolName }}. All rights reserved.</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
     <div class="flex">
      <uv-button  @tap="checkUpdate" type="warning">检查更新</uv-button>
      <uv-button  @tap="showPrivacy" type="error">隐私政策</uv-button>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      version: '1.0.0',
      schoolName: 'XX大学',
      feedbackContent: '',
      contactInfo: {
        phone: '010-12345678',
        email: 'canteen@university.edu.cn',
        address: 'XX大学第一食堂一楼服务台',
        workTime: '周一至周日 7:00-21:00'
      }
    }
  },
  methods: {
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: this.contactInfo.phone
      })
    },
    copyEmail() {
      uni.setClipboardData({
        data: this.contactInfo.email,
        success: () => {
          uni.showToast({
            title: '邮箱已复制',
            icon: 'success'
          })
        }
      })
    },
    submitFeedback() {
      if (!this.feedbackContent.trim()) {
        uni.showToast({
          title: '请输入意见内容',
          icon: 'none'
        })
        return
      }

      // 这里应该调用后端API提交反馈
      console.log('提交反馈:', this.feedbackContent)
      
      uni.showToast({
        title: '感谢您的建议！',
        icon: 'success'
      })
      
      this.feedbackContent = ''
    },
    checkUpdate() {
      uni.showToast({
        title: '当前已是最新版本',
        icon: 'none'
      })
    },
    showPrivacy() {
      uni.navigateTo({
        url: '/pages/privacy/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.about-us {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;

  &__header {
    text-align: center;
    padding: 40rpx 0;
    background-color: #fff;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }

  &__title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  &__section {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }

  &__section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }

  &__section-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-left: 10rpx;
  }

  &__content {
    .about-us__desc {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  &__contact-info {
    margin-top: 20rpx;
  }

  &__contact-item {
    display: flex;
    align-items: center;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &--clickable {
      cursor: pointer;
    }
  }

  &__contact-arrow {
    margin-left: auto;
  }

  &__contact-text {
    font-size: 28rpx;
    color: #666;
    margin-left: 20rpx;
    flex: 1;
  }

  &__feedback-form {
    margin-top: 20rpx;
  }

  &__feedback-input {
    width: 100%;
    height: 200rpx;
    padding: 20rpx;
    border: 1rpx solid #eee;
    border-radius: 10rpx;
    font-size: 28rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
  }

  

  &__version-info {
    margin-top: 20rpx;
    text-align: center;
  }

  &__version-text,
  &__copyright {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin: 10rpx 0;
  }

  &__footer-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
  }
}
.flex{
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    gap: 20rpx;
    :deep(.uv-button-wrapper){
        width: 49%!important;
    }
}
</style>