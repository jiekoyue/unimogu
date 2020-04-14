<template>
	<view class="phone-login-container">
		<view class="phone-validate">手机号验证</view>
		<view class="subtitle">用于及时获取课程最新信息</view>
		<view class="content">
			<input v-model="phone" class="phone" placeholder="请输入您的手机号" type="number" />
			<view @click="codeInfo" class="get_vcode" :style="{color: !isNaN(tips) ? '#ccc' : 'black'}">{{tips}}</view>
			<input v-model="vcode" class="vcode" placeholder="请输入验证码" type="number" />
		</view>
		<view class="phone-login" @click="phonelogin" v-if="vcode.length!=0">
			<image src="/static/images/phone_login@2x.png" alt />
		</view>
	</view>
</template>

<script>
	import ax from '../../utils/ax';
	export default {
		name: "phone-login",
		data() {
			return {
				tips: '获取验证码',
				phone: '17704051019',
				vcode: ''
			}
		},
		methods: {
			//获取验证码
			async codeInfo() {
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.phone)) {
					if (!isNaN(this.tips)) return;
					let {
						data
					} = await ax({
						url: 'user/vcode',
						data: {
							phone: this.phone //17704051019
						}
					});
					if (data.status != 0) {
						uni.showToast({
							title: data.message,
							icon: 'none'
						});
						return;
					};
					this.tips = 10;
					this.timeId = setInterval(() => {
						this.tips--;
						if (this.tips <= 0) {
							clearInterval(this.timeId);
							this.tips = '获取验证码';
						}
					}, 1000)
					uni.showToast({
						title: "" + data.vcode,
						icon: 'none'
					})
					console.log(data.vcode);
				} else {
					uni.showToast({
						title: '手机号不合法',
						icon: 'none'
					});
				}

			},
			//点击登录
			async phonelogin() {
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.phone)) {
					if (this.vcode.length != 4) {
						uni.showToast({
							title: '验证码错误',
							icon: 'none'
						});
						return;
					}
					let {
						data
					} = await ax({
						url: 'user/login',
						method: 'POST',
						data: {
							phone: this.phone,
							vcode: this.vcode
						}
					});
					uni.showToast({
						title: data.message,
						icon: 'none'
					});
					if (data.status != 0) {
						return;
					}
					uni.setStorageSync('mgtoken', data.token);
					
					uni.reLaunch({
						url: '/pages/home/index'
					});
				} else {
					uni.showToast({
						title: '手机号不合法',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.phone-login-container {
		padding: 0rpx 68rpx;

		.phone-validate {
			margin-top: 100rpx;
			color: #393939;
			font-size: 43px;
		}

		.subtitle {
			margin-top: 20rpx;
			color: #a8a8a8;
			font-size: 30rpx;
		}

		.content {
			margin-top: 150rpx;
			height: 250rpx;
			position: relative;

			.phone {
				height: 100rpx;
				font-size: 15px;
				// background-color: green;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					background-color: #e9e9e9;
					left: 0;
					right: 0;
					height: 1px;
					bottom: 1px;
				}
			}

			.get_vcode {
				position: absolute;
				right: 0;
				top: 20rpx;
				width: 164rpx;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				font-size: 24rpx;
				color: #a8a8a8;
				border: 1px solid rgba(168, 168, 168, 1);
				border-radius: 20px;
				z-index: 2;
			}

			.vcode {
				margin-top: 30px;
				height: 100rpx;
				font-size: 15px;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					background-color: #e9e9e9;
					left: 0;
					right: 0;
					height: 1px;
					bottom: 1px;
				}
			}
		}

		.phone-login {
			margin-top: 120px;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 568rpx;
				height: 98rpx;
			}
		}
	}
</style>
