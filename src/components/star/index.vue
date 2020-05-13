<template>
	<view class="container">
		<view class="star-bg">
			<image v-for="(item,index) in 5" @click="starfn(index)" :key="item" src="../../static/images/star_empty@2x.png" mode=""></image>
		</view>
		<view class="star">
			<image v-for="(item,index) in xing" :key="item" src="../../static/images/star_fill@2x.png" @click="starfn(index)"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			num: {
				type: Number,
				default: 5
			},
			isDj:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				xing:this.num
			}
		},
		methods:{
			starfn(i){
				if(this.isDj){
					this.xing = i+1;
					this.$emit('input',this.xing)
				}
			}
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
