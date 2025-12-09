<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
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
