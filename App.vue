<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检查用户登录状态，仅在启动时检查一次
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				uni.navigateTo({
					url: '/pages/account/login'
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	page {
		background-color: #F6F7F9;
	}
	:root {
		--primary-color: #00C853;
		--secondary-color: #E8F5E9;
		--accent-color: #FF9800;
		--card-radius: 24rpx;
		--btn-radius: 50rpx;
	}
	/* #endif */
</style>
