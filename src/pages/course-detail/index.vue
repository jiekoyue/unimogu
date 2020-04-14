<template>
	<view class="course-detail-container" v-if="courseInfo">
		<!-- 封面图 -->
		<view class="cover_image" v-if="isVideo">
			<image :src="courseInfo.course.cover_image_url" mode=""></image>
			<view class="play" @click="pfan">
				<image src="/static/images/play@2x.png" mode=""></image>
				<text>播放课程简介</text>
			</view>
		</view>
		<view class="course_video" v-else>
			<video @error="videoErrorCallback" autoplay :src="courseInfo.course.course_video_url"></video>
		</view>
		<!-- 简介 -->
		<view class="introduction">
			<view class="title-price">
				<text>{{courseInfo.course.title}}</text>
				<text>￥{{courseInfo.course.price}}.00</text>
			</view>
			<text class="introduce">{{courseInfo.course.introduction}}</text>
			<view class="star">
				<!-- 评分 -->
				<star :num="courseInfo.course.score"></star>
				<text>{{courseInfo.course.study_count}}人在学</text>
			</view>
			<view class="study-share">
				<image src="/static/images/start_study@2x.png" mode="" @click="palyfn"></image>
				<!-- <view class="share-button"></view> -->
				<button class="share-button" open-type="share"></button>
			</view>
		</view>
		<!-- 目录、讲师介绍、评价 -->
		<view class="catalog">
			<view class="head">
				<text v-for="(item,index) in mlarr" :key="index" :class="{active:mindex==index}" @click="mlfn(index)">{{item}}</text>
			</view>
			<view class="catelog-container" v-if="mindex==0">
				<text v-for="item in courseInfo.videos" :key="item.id">{{item.name}}</text>
			</view>
			<view class="lecturer-container" v-else-if="mindex==1">
				<view class="info">
					<image :src="courseInfo.lecturer.avatar" mode=""></image>
					<view class="name-follow">
						<text>{{courseInfo.lecturer.name}}</text>
						<text>关注人数：{{courseInfo.lecturer.follow_count}}</text>
					</view>
					<view :class="courseInfo.lecturer.is_follow?'follow':'unfollow'" @click="followfn">
						{{courseInfo.lecturer.is_follow?'已关注':'关注'}}
					</view>
				</view>
				<view class="introduce">
					<text>{{courseInfo.lecturer.introduction}}</text>
				</view>
			</view>
			<view v-else-if="mindex==2">
				<view class="comment-item" v-for="item in courseInfo.comments" :key="item.id">
					<view class="info">
						<image :src="item.avatar" mode=""></image>
						<view class="nickname-content">
							<view class="nickname">
								{{item.nickname}}
								<star style="margin-left: 20rpx;" :num="item.score"></star>
							</view>
							<view>
								{{item.content}}
							</view>
						</view>
						<view class="time">
							{{item.comment_time}}
						</view>
					</view>
					<view class="star">
						<image @click="islickfn(item)" :src="item.is_like==2?'../../static/images/like_highlight@2x.png':'../../static/images/like_normal@2x.png'"
						 mode=""></image>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import ax from '../../utils/ax';
	import star from '../../components/star/index.vue';
	export default {
		components: {
			star
		},
		data() {
			return {
				courseInfo: '',
				isVideo: true,
				mlarr: ['目录', '讲师介绍', '评价'],
				mindex: 2,
				id:null
			}
		},
		methods: {
			//获取课程详情
			async kcxq(id) {
				let {
					data
				} = await ax({
					url: 'course/' + id
				});
				this.courseInfo = data.message;
				this.mlarr[2] = `评价(${data.message.commentTotal})`
			},
			//点击播放按钮
			pfan() {
				console.log(1)
				this.isVideo = false;
			},
			//播放视频错误
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			//点击目录
			mlfn(index) {
				this.mindex = index;
			},
			//点击关注
			async followfn() {
				if (this.courseInfo.lecturer.is_follow) {
					let {
						data
					} = await ax({
						url: 'lecturer/unfollow',
						method: 'POST',
						data: {
							lecturer_id: this.courseInfo.lecturer.id
						}
					});
					if (data.status != 0) {
						uni.showToast({
							title: data.message,
							icon: 'none'
						})
						return;
					}
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					this.courseInfo.lecturer.is_follow = 0;
				} else {
					let {
						data
					} = await ax({
						url: 'lecturer/follow',
						method: 'POST',
						data: {
							lecturer_id: this.courseInfo.lecturer.id
						}
					});
					if (data.status != 0) {
						uni.showToast({
							title: data.message,
							icon: 'none'
						})
						return;
					}
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					this.courseInfo.lecturer.is_follow = 1;
				}
			},
			//点赞
			async islickfn(item) {
				let {data} = await ax({
					url: 'comment/like',
					method: 'POST',
					data: {
						is_like: item.is_like == 2 ? 1 : 2,
						comment_id:item.id
					}
				});
				console.log(data);
				if(data.status!=0) {
					uni.showToast({
						title:data.message,
						icon:'none'
					})
					return;
				}
				item.is_like = item.is_like == 2 ? 1 : 2;
				uni.showToast({
					title:item.is_like==2?'点赞成功':'取消点赞成功',
					icon:'none'
				});
			},
			//
			palyfn(){
				uni.navigateTo({
					url:'/pages/play/index?id='+this.id
				})
			}
		},
		onLoad(e) {
			this.id = e.id;
		},
		onShow(){
			this.kcxq(this.id);
		},
		onShareAppMessage(obj) {
			return {
				title: 'aa',
				imageUrl: 'http://img0.imgtn.bdimg.com/it/u=3880341262,3308316348&fm=26&gp=0.jpg'
			}
		}
	}
</script>

<style lang="less" scoped>
	.course-detail-container {
		background-color: #efefef;
		position: relative;

		.cover_image {
			width: 750rpx;
			height: 434rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 750rpx;
				height: 434rpx;
			}

			position: relative;

			.play {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				position: absolute;

				image {
					width: 164rpx;
					height: 164rpx;
				}

				text {
					margin-top: 10rpx;
					color: #e9e9e9;
					font-size: 30rpx;
				}
			}
		}

		.course_video {
			width: 750rpx;
			height: 434rpx;

			video {
				width: 750rpx;
				height: 434rpx;
			}
		}

		.introduction {
			z-index: 3;
			position: absolute;
			margin-top: 0rpx;
			border-radius: 16px 16px 0px 0px;
			left: 0;
			right: 0;
			height: 452rpx;
			background-color: #ffffff;
			padding: 20rpx 30rpx;

			.title-price {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text:nth-child(1) {
					font-size: 24px;
					color: #343434;
					font-weight: Bold;
				}

				text:nth-child(2) {
					font-size: 22px;
					color: #ee3939;
				}
			}

			.introduce {
				color: #818181;
				font-size: 12px;
				margin-top: 100rpx;
			}

			.star {
				display: flex;
				margin-top: 20rpx;

				text {
					height: 50rpx;
					line-height: 50rpx;
					margin-left: 20rpx;
					font-size: 12px;
					color: #fe8e38;
				}
			}

			.study-share {
				margin-top: 42rpx;
				margin-bottom: 52rpx;

				image:nth-child(1) {
					width: 568rpx;
					height: 92rpx;
				}

				.share-button {
					border: none;
					width: 92rpx;
					height: 92rpx;
					background-color: #fff;
					border-radius: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					float: right;
					background-image: url(../../static/images/share@2x.png);
					background-repeat: no-repeat;
					background-size: 34rpx 34rpx;
					background-position: 30rpx 30rpx;
				}
			}
		}

		.catalog {
			margin-top: 520rpx;
			// position: absolute;
			z-index: 5;
			width: 750rpx;
			// height: 582rpx;
			background-color: #ffffff;

			.head {
				height: 120rpx;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #f5f5f5;

				text {
					text-align: center;
					color: #a8a8a8;
					font-size: 14px;
					height: 120rpx;
					line-height: 120rpx;
					flex: 1;
					position: relative;
				}

				.active {
					color: #333333;
					font-weight: bold;

					&::after {
						content: '';
						position: absolute;
						left: 88rpx;
						bottom: 0px;
						width: 74rpx;
						height: 3px;
						background-color: #ff8e43;
					}
				}
			}

			.catelog-container {
				padding: 30rpx;
				height: 582rpx;

				text {
					background-color: #ffffff;
					color: #636363;
					font-size: 30rpx;
					height: 80rpx;
					line-height: 80rpx;
					display: block;
				}
			}

			.lecturer-container {
				padding: 30rpx;

				.info {
					height: 200rpx;
					display: flex;
					align-items: center;

					.name-follow {
						margin-left: 30rpx;
						display: flex;
						flex-direction: column;
						flex: 1;

						text:nth-child(1) {
							font-size: 34rpx;
							color: #333333;
						}

						text:nth-child(2) {
							font-size: 28rpx;
							margin-top: 15rpx;
							color: #a8a8a8;
						}
					}

					image {
						margin-left: 12rpx;
						width: 120rpx;
						height: 120rpx;
					}

					.unfollow {
						width: 136rpx;
						height: 52rpx;
						line-height: 52rpx;
						text-align: center;
						border: 1px solid #a8a8a8;
						border-radius: 26rpx;
						color: #a8a8a8;
						font-size: 28rpx;
					}

					.follow {
						width: 136rpx;
						height: 52rpx;
						line-height: 52rpx;
						text-align: center;
						border: 1px solid #a8a8a8;
						border-radius: 26rpx;
						color: #fff;
						background-color: #a8a8a8;
						font-size: 28rpx;
					}
				}

				.introduce {
					background-color: #ffffff;

					text {
						margin-left: 12rpx;
						font-size: 12px;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 20px;
						color: rgba(168, 168, 168, 1);
						opacity: 1;
					}
				}
			}

			.comment-item {
				background-color: #ffffff;
				padding: 30rpx;
				height: 180rpx;
				border-bottom: 2px solid #f1f1f1;

				.info {
					height: 120rpx;
					display: flex;
					align-items: center;

					image {
						margin-left: 6rpx;
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
					}

					.nickname-content {
						flex: 1;
						margin-left: 30rpx;

						.nickname {
							color: #333333;
							font-size: 30rpx;
							font-weight: bold;
							align-items: center;
							display: flex;

							view {
								height: 100%;
								display: inline-block;
							}
						}

						view:nth-child(2) {
							margin-top: 16rpx;
							color: #a8a8a8;
							font-size: 12px;
						}
					}

					.time {
						color: #a8a8a8;
						font-size: 11px;
					}
				}
			}

			.star {
				image {
					margin-top: 30rpx;
					width: 44rpx;
					height: 44rpx;
					float: right;
					margin-right: 20rpx;
				}

				image:nth-child(0) {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
