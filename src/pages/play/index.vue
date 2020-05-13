<template>
	<view class="play-container" v-if="courInfo">
		<!-- 视频播放 -->
		<view class="cover_image">
			<video :src="palyUrl" id="videoId" @pause="shipat" @ended="bfwb" @timeupdate="jdbh"></video>
		</view>
		<!-- 简介 -->
		<view class="introduction">
			<view class="title-and-info">
				<view class="title">
					{{courInfo.course.title}}
				</view>
				<view class="info">
					<text>{{courInfo.course.study_count}} 人学过</text>
					<!-- <text>难度:{{courInfo.course.level}}</text> -->
					<text>难度:{{dj}}</text>
					<text>时长:{{courInfo.course.course_duration}}</text>
				</view>
			</view>
			<view class="comment">
				<image @click="evaluate" src="/static/images/evaluate@2x.png" alt />
			</view>
			<!-- 评论款框-->
			<modal ref="modal" @tj="tjfn">
				<view class="comment-content">
					<textarea v-model="plTxt" placeholder="请输入评论内容哦~" rows="5"></textarea>
				</view>
				<view style="margin-top:10rpx;">
					<text>评分：</text>
					<view style="float:right;margin-right:300rpx;margin-top:-5rpx;">
						<srar v-model="plxx" isDj />
					</view>
				</view>
			</modal>
		</view>
		<!-- 视频列表 -->
		<view class="course-progress">
			<view class="title">课程进度</view>
			<view class="catelog-container">
				<view class="course-item" @click="playVideofn(index)" :key="item.id" v-for="(item,index) in courInfo.videos">
					<text :class="{active:palyIndex==index}">{{item.name}}</text>
					<text :class="item.is_study==1?'studied':''">{{item.is_study==1?'已学习':item.duration}}</text>
					<!-- <text class="time"></text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ax from '../../utils/ax';
	import modal from '../../components/modal/index.vue';
	import srar from '../../components/star/index.vue';
	export default {
		components: {
			modal,
			srar
		},
		data() {
			return {
				id: null,
				courInfo: null,
				palyUrl: '',
				videoid: null,
				palyIndex: -1,
				palyTime: null,
				palyTimeArr: [0],
				plTxt: '',
				plxx: 5
			}
		},
		computed: {
			dj() {
				if (!this.courInfo) return
				switch (this.courInfo.course.level) {
					case 1:
						return '初级';
					case 2:
						return '中级';
					case 3:
						return '高级';
					default:
						return ''
				}
			}
		},
		methods: {
			//获取数据
			async setInfo() {
				let {
					data
				} = await ax({
					url: 'course/play/' + this.id
				});
				this.courInfo = data.message;
				for (var i = 0; i < data.message.videos.length; i++) {
					if (!data.message.videos[i].is_study) {
						if (i == 0) return;
						this.palyIndex = i - 1;
						const videoid = uni.createVideoContext('videoId');
						this.palyUrl = this.courInfo.videos[i - 1].video_url;
						setTimeout(() => {
							videoid.play();
						}, 200);
						return;
					}
				}
				this.palyIndex = data.message.videos.length - 1;
				const videoid = uni.createVideoContext('videoId');
				this.palyUrl = this.courInfo.videos[this.palyIndex].video_url;
				setTimeout(() => {
					// videoid.play();
				}, 200);
			},
			//点击视频列表
			async playVideofn(index) {
				this.palyIndex = index;
				let isKey = await this.playStaus();
				if (!isKey) {
					uni.showModal({
						title: '提示',
						content: '您还没有支付，请先支付后，\n再来观看哦~',
						confirmText: '去支付',
						confirmColor: '#fd8d4c',
						success: res => {
							if (res.confirm) {
								let {
									title,
									cover_image_url,
									price
								} = this.courInfo.course
								uni.navigateTo({
									url: `/pages/pay/index?id=${this.id}&title=${title}&cover_image_url=${cover_image_url}&price=${price}`
								})
							}
						}
					});
					return;
				}
				const videoid = uni.createVideoContext('videoId');
				videoid.pause();
				this.palyUrl = this.courInfo.videos[index].video_url;
				setTimeout(() => {
					videoid.play();
				}, 200);
				let videores = await ax({
					url: 'study/video',
					method: 'POST',
					data: {
						course_id: this.id,
						video_id: this.courInfo.videos[index].id
					}
				});
				if (videores.data.status != 0) return;
				this.courInfo.videos[index].is_study = 1;
			},
			//判断是否购买
			playStaus() {
				return new Promise(async (resolve, reject) => {
					let {
						data
					} = await ax({
						url: 'order/paystatus',
						data: {
							course_id: this.id
						}
					});
					if (data.status == 0) {
						if (data.pay_status == 0) {
							resolve(false);
						} else {
							resolve(true);
						}
					} else {
						resolve(false);
					}
				})
			},
			//当视频暂停时
			shipat(e) {
				console.log('视频暂停', e);
				this.palyTime = this.palyTimeArr[0];
			},
			//当视频播放完时
			bfwb(e) {
				console.log('视频完', e);
				if (this.palyIndex >= this.courInfo.videos.length - 1) return;
				this.playVideofn(++this.palyIndex);
			},
			//播放进度变化
			jdbh(e) {
				// this.set(this.palyTimeArr,0,e.detail.currentTime);
				this.palyTime = e.detail.currentTime;
				// console.log(e.detail.currentTime);
			},
			//评论
			async evaluate() {
				let {
					data
				} = await ax({
					url: 'study/complete',
					data: {
						course_id: this.id
					}
				});
				if (!data.complete) {
					uni.showModal({
						title: '提示',
						content: '请先学习完，在来评论~~',
						showCancel: false,
						confirmColor: '#fd8d4c'
					});
					return;
				}

				console.log(this.$refs.modal);
				this.$refs.modal.isShow = true;
			},
			// 评论提交
			async tjfn(){
				console.log(this.plTxt,this.plxx);
				if(!this.plTxt) {
					uni.showToast({
						title:'评论内容不能为空',
						icon:'none',
						duration:1000
					});
					return;
				}
				let {data} = await ax({
					url:'comment/create',
					method:'POST',
					data:{
						course_id:this.id,
						content:this.plTxt,
						score:this.plxx
					}
				});
				console.log(data);
				uni.showToast({
					title:data.message,
					icon:'none',
					duration:500
				});
				if(data.status==0){
					setTimeout(()=>{
						this.$refs.modal.isShow = false;
					},250);
				}
			}
		},
		onLoad(e) {
			this.id = e.id;
		},
		mounted() {
			this.setInfo();
		},
		onShow() {
			if (!this.palyTime) return;
			const videoid = uni.createVideoContext('videoId');
			setTimeout(() => {
				videoid.play();
			}, 200);
		},
		onHide() {
			const videoid = uni.createVideoContext('videoId');
			videoid.pause();
		}
	}
</script>

<style lang="less" scoped>
	.play-container {
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

			video {
				width: 750rpx;
				height: 434rpx;
			}
		}

		.introduction {
			z-index: 3;
			position: absolute;
			margin-top: -10rpx;
			border-radius: 16px 16px 0px 0px;
			border-bottom: 1px solid #f5f5f5;
			left: 0;
			right: 0;
			height: 192rpx;
			background-color: #ffffff;
			padding: 38rpx 32rpx;
			display: flex;
			align-items: center;

			.title-and-info {
				flex: 1;

				.title {
					color: #343434;
					font-size: 24px;
					font-weight: bold;
				}

				.info {
					margin-top: 12rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #818181;
					font-size: 12px;
					display: block;

					text {
						padding-right: 15rpx;
					}

					text:nth-child(2),
					text:nth-child(3) {
						padding-left: 15rpx;
					}

					text:nth-child(2) {
						position: relative;

						&::before {
							position: absolute;
							content: '';
							background-color: #ebebeb;
							left: 0rpx;
							width: 1px;
							top: 8rpx;
							height: 20rpx;
						}

						&::after {
							position: absolute;
							content: '';
							background-color: #ebebeb;
							right: 0rpx;
							width: 1px;
							top: 8rpx;
							height: 20rpx;
						}
					}
				}
			}

			.comment {
				margin-top: 32rpx;

				image {
					width: 198rpx;
					height: 80rpx;
				}
			}
		}

		.course-progress {
			margin-top: 222rpx;
			padding: 44rpx 32rpx;
			background-color: #fff;

			.title {
				color: #343434;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 800;
			}

			.catelog-container {
				.course-item {
					display: flex;
					justify-content: space-between;
				}

				text {
					color: #636363;
					font-size: 30rpx;
					height: 80rpx;
					line-height: 80rpx;
				}

				.studied {
					float: right;
					margin-top: 16rpx;
					font-size: 10px;
					text-align: center;
					color: #aaaaaa;
					background-color: #f5f5f5;
					border-radius: 12rpx;
					width: 98rpx;
					height: 48rpx;
					line-height: 48rpx;
				}

				.time {
					float: right;
				}

				.active {
					color: #ff5e00;
				}
			}
		}
	}

	.comment-content {
		label {
			width: 100rpx;
		}

		textarea {
			width: 100%;
			height: 200rpx;
		}
	}
</style>
