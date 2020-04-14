<template>
	<view class="home-container">
		<!-- searchbur -->
		<searchbar pl="请输入课程的名称"></searchbar>
		<swiper indicator-dots autoplay :interval="3000" circular>
			<swiper-item v-for="item in lbt" :key="item.id" @click="gokcfn(item.course_id)">
				<image :src="item.img_url" />
			</swiper-item>
		</swiper>
		<view>
			<view class="tips">
				<text>推荐课程</text>
				<image src="/static/images/arrow@2x.png" @click="rmkc"/>
			</view>
			<scroll-view class="course-container" scroll-x>
				<view class="course-item" v-for="item in kc" :key="item.id">
					<image :src="item.icon" />
				</view>
			</scroll-view>
		</view>
		<view>
			<view class="tips">
				<text>热门视频</text>
				<image src="/static/images/arrow@2x.png" />
			</view>
			<view class="hot-video">
				<view class="video-item" v-for="item in sp" :key="item.id">
					<image :src="item.cover_photo_url" />
					<view>
						<text class="title">{{item.name}}</text>
					</view>
					<view>
						<text class="subtitle">{{item.view_count}}人已观看</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import ax from '../../utils/ax';
	import searchbar from '../../components/search-bar/index.vue';
	export default Vue.extend({
		components: {
			searchbar,
		},
		data() {
			return {
				lbt: null,
				kc: null,
				sp: null,
			}
		},
		onLoad() {
			this.lbtfn();
			this.kcfn();
			this.spfn();
		},
		methods: {
			//获取轮播图
			async lbtfn() {
				let {
					data: {
						message
					}
				} = await ax({
					url: 'home/swipers'
				});
				this.lbt = message;
			},
			//获取首页推荐课程
			async kcfn() {
				let {
					data: {
						message
					}
				} = await ax({
					url: 'home/course'
				});
				this.kc = message;
			},
			//获取首页热门视频
			async spfn() {
				let {
					data: {
						message
					}
				} = await ax({
					url: 'home/video'
				});
				this.sp = message;
			},
			//点击热门课程
			rmkc(){
				uni.switchTab({
					url:'/pages/course/index'
				})
			},
			//跳转课程详情
			gokcfn(id){
				uni.navigateTo({
					url:'/pages/course-detail/index?id='+id
				})
			}
		}
	});
</script>

<style lang="less" scoped>
	.home-container {
		padding: 20rpx;
		background-color: #fff;
	}

	swiper {
		width: 100%;
		height: 342rpx;

		swiper-item {
			width: 100%;
			height: 100%;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.tips {
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		text {
			font-size: 36rpx;
			font-weight: 700;
			color: #212121;
		}

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.course-container {
		height: 170rpx;
		white-space: nowrap;

		.course-item {
			width: 296rpx;
			height: 168rpx;
			display: inline-block;
			margin-right: 32rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.hot-video {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.video-item {
			width: 340prx;

			image {
				width: 340rpx;
				height: 210rpx;
				border-radius: 12rpx;
			}

			.title {
				margin-top: 15rpx;
				color: #262626;
				font-size: 26rpx;
			}

			.subtitle {
				margin-top: 15rpx;
				margin-bottom: 15rpx;
				color: #959595;
				font-size: 18rpx;
			}
		}
	}
</style>
