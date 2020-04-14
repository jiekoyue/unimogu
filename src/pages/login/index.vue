<template>
	<view class="login-container">
		<image class="logo" src="/static/images/logo@2x.png" alt />
		<text class="title">蘑菇在线</text>
		<image class="login-tips" src="/static/images/login_tips@2x.png" alt />
		<button open-type="getUserInfo" @getuserinfo="wxlogin" plain class="wx-login-button">
			<image class="wx-login-img" src="/static/images/wx_login@2x.png" alt />
		</button>
		<text class="phone-login" @click="phoneClick">手机号登录</text>
		<text class="bottom-tip">Copyright © 2019 蘑菇在线</text>

	</view>
</template>

<script>
	import ax from '../../utils/ax';
	export default {
		name: "login",
		methods: {
			//授权登录
			wxlogin({
				detail
			}) {
				if (detail.errMsg == "getUserInfo:fail auth deny") return;
				uni.login({
					provider: 'weixin',
					success: async ({
						code
					}) => {
						let {
							data
						} = await ax({
							url: 'user/wxlogin',
							method: 'POST',
							data: {
								code,
								nickname: detail.userInfo.nickName,
								avatar: detail.userInfo.avatarUrl
							}
						});
						console.log(data);
						if (data.status == 0) {
							uni.showToast({
								title: '登录成功',
								icon: 'none',
								duration: 500
							});
							uni.setStorageSync('mgtoken', data.token);
							uni.reLaunch({
								url: '/pages/home/index'
							})
						}
					}
				});
			},
			//手机号码
			phoneClick() {
				uni.navigateTo({
					url: '/pages/phone-login/index'
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.logo {
			margin-top: 180rpx;
			width: 212rpx;
			height: 212rpx;
		}

		.title {
			color: #333333;
			font-size: 24px;
			margin-top: 20rpx;
		}

		.login-tips {
			margin-top: 30rpx;
			height: 34rpx;
			width: 292rpx;
			position: relative;
		}

		.wx-login-button {
			margin-top: 200rpx;
			width: 568rpx;
			height: 98rpx;
			padding: 0;
			border: none;
		}

		.wx-login-img {
			// margin-top:20rpx;
			width: 568rpx;
			height: 98rpx;
		}

		.phone-login {
			margin-top: 40rpx;
			color: #333333;
			font-size: 15px;
		}

		.bottom-tip {
			color: #a8a8a8;
			font-size: 10px;
			position: absolute;
			bottom: 40rpx;
		}
	}

	.wx-login-container {
		position: relative;

		.wx-login-tip1 {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 450rpx;
			padding-top: 50rpx;

			img {
				width: 198rpx;
				height: 198rpx;
			}

			p {
				color: #bebebe;
				margin-top: 50rpx;
				font-size: 13px;
			}
		}

		.wx-login-tip1-cover {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			height: 500rpx;
			background: rgba(0, 0, 0, 1);
			opacity: 0.16;
		}
	}
</style>
