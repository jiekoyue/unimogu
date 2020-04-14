<template>
	<view class="container">
		<view class="star-bg">
			<image v-for="item in 5" :key="item" src="../../static/images/star_empty@2x.png" mode=""></image>
		</view>
		<view class="star">
			<image v-for="item in num" :key="item" src="../../static/images/star_fill@2x.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			num: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				
			}
		},
		methods:{
			
		},
		mounted() {
			
		}
	}
</script>

<style lang="less" scoped>
	.container {
		position: relative;
	}

	.star,
	.star-bg {
		float: left;
		display: flex;
		height: 50rpx;
		align-items: center;

		image {
			width: 38rpx;
			height: 36rpx;
		}
	}

	.star {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
