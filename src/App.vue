<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		mpType: 'app',
		onLaunch() {
			if (uni.getStorageInfoSync("mgtoken")) {
				// uni.reLaunch({
				// 	url: '/pages/home/index'
				// })
			}else{
				uni.reLaunch({
					url: '/pages/login/index'
				})
			}
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	});
</script>

<style>
	/*每个页面公共css */
	page {
		background: #f8f8f8;
		min-height: 100%;
	}
</style>
