<template>
    <view class="privacy-policy__content">
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">引言</text>
        <text class="privacy-policy__text">
          欢迎您使用智慧食堂服务。智慧食堂非常重视您的隐私和个人信息安全。本隐私政策旨在向您说明我们在提供服务过程中如何收集、使用、保护您的个人信息，以及您享有的权利。请您在使用我们的服务前，仔细阅读并了解本隐私政策。
        </text>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">我们如何收集您的信息</text>
        <text class="privacy-policy__text">
          在您使用智慧食堂服务过程中，我们会收集以下信息：
        </text>
        <view class="privacy-policy__list">
          <text class="privacy-policy__list-item">1. 您主动提供的信息：如注册账户时输入的手机号、姓名等；</text>
          <text class="privacy-policy__list-item">2. 订单相关信息：包括您选择的菜品、下单时间、支付记录等；</text>
          <text class="privacy-policy__list-item">3. 设备信息：包括设备型号、操作系统版本、唯一设备标识符等；</text>
          <text class="privacy-policy__list-item">4. 日志信息：包括您使用服务的具体方式、操作记录等。</text>
        </view>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">我们如何使用您的信息</text>
        <text class="privacy-policy__text">
          我们可能将收集的信息用于以下目的：
        </text>
        <view class="privacy-policy__list">
          <text class="privacy-policy__list-item">1. 向您提供服务：处理您的订单、完成交易、提供客户服务；</text>
          <text class="privacy-policy__list-item">2. 改进服务质量：通过分析用户行为优化产品功能；</text>
          <text class="privacy-policy__list-item">3. 安全保障：检测和防范欺诈行为，确保服务安全；</text>
          <text class="privacy-policy__list-item">4. 法律合规：遵守相关法律法规的要求。</text>
        </view>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">我们如何保护您的信息</text>
        <text class="privacy-policy__text">
          我们采取多种安全措施保护您的个人信息，包括：
        </text>
        <view class="privacy-policy__list">
          <text class="privacy-policy__list-item">1. 技术措施：使用加密技术保护您的信息安全传输；</text>
          <text class="privacy-policy__list-item">2. 管理措施：建立数据安全管理制度，对员工进行隐私保护培训；</text>
          <text class="privacy-policy__list-item">3. 数据最小化原则：只保留为您提供服务所必需的信息。</text>
        </view>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">您的权利</text>
        <text class="privacy-policy__text">
          您对您的个人信息享有以下权利：
        </text>
        <view class="privacy-policy__list">
          <text class="privacy-policy__list-item">1. 访问权：您可以访问您的个人信息；</text>
          <text class="privacy-policy__list-item">2. 更正权：您可以修改不准确的个人信息；</text>
          <text class="privacy-policy__list-item">3. 删除权：在特定情况下，您可以要求删除您的个人信息；</text>
          <text class="privacy-policy__list-item">4. 撤回同意权：您可以撤回之前授予的同意。</text>
        </view>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">信息共享</text>
        <text class="privacy-policy__text">
          我们不会与第三方共享您的个人敏感信息，除非：
        </text>
        <view class="privacy-policy__list">
          <text class="privacy-policy__list-item">1. 获得您的明确同意；</text>
          <text class="privacy-policy__list-item">2. 根据法律法规要求；</text>
          <text class="privacy-policy__list-item">3. 为维护公共利益或合法权益。</text>
        </view>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">政策变更</text>
        <text class="privacy-policy__text">
          我们可能会适时修订本隐私政策。如有重大变更，我们将通过应用内通知等方式告知您。您继续使用我们的服务即表示您同意接受修订后的隐私政策。
        </text>
      </view>
      
      <view class="privacy-policy__section">
        <text class="privacy-policy__section-title">联系我们</text>
        <text class="privacy-policy__text">
          如您对本隐私政策有任何疑问，可通过"关于我们"页面中的联系方式与我们取得联系。
        </text>
        <text class="privacy-policy__text">
          生效日期：2023年1月1日
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.privacy-policy {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
  
  &__header {
    background-color: #fff;
    padding: 40rpx 30rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    text-align: center;
  }
  
  &__title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  &__content {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 30rpx;
  }
  
  &__section {
    margin-bottom: 40rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 20rpx;
  }
  
  &__text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    display: block;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__list {
    padding-left: 20rpx;
  }
  
  &__list-item {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    display: block;
    margin-bottom: 15rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>