<template>
	<view class="study-container">
		<view class="study-item" v-for="item in studyInfo" :key="item.sid" @click="gokcfn(item.sid)">
			<image :src="item.icon"></image>
			<view class="meta">
				<view class="title">
					{{item.title}}
				</view>
				<view class="title">
					已学习{{item.study_hour}}课时/{{item.total_hour || 0}}课时
				</view>
			</view>
			<view class="circle">
				<cricle v-if="key" :criid="item.sid" :jd="item.study_progress"></cricle>
			</view>
		</view>
	</view>
</template>

<script>
	import ax from '../../utils/ax.ts';
	import cricle from '../../components/circle/index.vue';
	export default {
		name: "",
		components: {
			cricle
		},
		data() {
			return {
				studyInfo: [],
				key:true
			}
		},
		methods: {
			async setInfo() {
				let {
					data
				} = await ax({
					url: 'study/progress'
				});
				this.studyInfo = data.message;
			},
			//跳转课程详情
			gokcfn(id){
				console.log(id);
				uni.navigateTo({
					url:'/pages/play/index?id='+id
				})
			}
		},
		onShow() {
			this.key = false;
			this.$nextTick(()=>{
				this.key = true;
			})
			this.setInfo();
		}
	}
</script>

<style lang="less" scoped>
	.study-container {
		display: flex;
		flex-direction: column;
		padding-bottom: 32rpx;
		align-items: center;
		position: relative;
	}

	.study-item {
		margin-top: 32rpx;
		background-color: #fff;
		border-radius: 12rpx;
		width: 686rpx;
		height: 220rpx;
		display: flex;
		align-items: center;

		image {
			width: 108rpx;
			height: 108rpx;
			margin-left: 50rpx;
		}

		.meta {
			flex: 1;
			margin-left: 50rpx;

			.title {
				font-size: 30rpx;
				color: #333333;
			}

			.progress {
				margin-top: 10rpx;
				font-size: 22rpx;
				color: #a8a8a8;
			}
		}

		.circle {
			width: 109rpx;
			height: 109rpx;
			margin-right: 56rpx;
		}
	}

	.no-study-tip {
		margin-top: 500rpx;
		font-size: 15px;
	}
</style>
