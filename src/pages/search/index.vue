<template>
	<view class="search-container">
		<view class="search-head">
			<uni-search-bar v-model="searTxt" style="width: 100%;" :radius="100" @confirm="search"></uni-search-bar>
		</view>
		<view class="search-body">
			<view class="empty" v-if="courses.length === 0">
				<text class="title">暂无内容哦~</text>
			</view>
			<courselist :courses="courses" />
		</view>
	</view>
</template>

<script>
	import {
		uniSearchBar
	} from '@dcloudio/uni-ui';
	import courselist from '../../components/courselist/index.vue';
	import ax from '../../utils/ax.ts';
	export default {
		components: {
			uniSearchBar,
			courselist
		},
		data() {
			return {
				courses: [],
				searTxt: '编程',
			}
		},
		methods: {
			//搜索事件
			async search(e) {
				let {
					data
				} = await ax({
					url: 'course/search',
					data: {
						name: e.value
					}
				});
				console.log(data);
				if (data.message.length == 0) {
					uni.showToast({
						title: '未搜索到请重新输入',
						icon: "none"
					})
				}
				this.courses = [];
				this.courses = data.message;
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-container {
		display: flex;
		flex-direction: column;
		background: #fff;
		min-height: 100%;
	}

	.search-head {
		padding: 30rpx 0;
		display: flex;
	}

	.search-input {
		margin-left: 30rpx;
		margin-right: 30rpx;
		padding-left: 55rpx;
		width: 100%;
		height: 74rpx;
		background: rgba(243, 243, 243, 1);
		opacity: 1;
		border-radius: 8px;
		font-size: 14px;
		flex: 1;
	}

	.icon-search {
		position: absolute;
		left: 40rpx;
		top: 48rpx;
		width: 56rpx;
		height: 56rpx;
		color: #a8a8a8;
	}

	.search-button {
		margin-right: 30rpx;
		width: 100rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		color: #ff951c;
	}

	.search-body {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 32rpx;
		width: 100%;
		height: 100%;
	}

	.empty {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 600rpx;
	}

	.empty .title {
		font-size: 14px;
		color: gray;
	}
</style>
