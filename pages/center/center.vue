<template>
	<view class="center">
		<view style="background: #fff">
			<view>
				<image class="center-user-pic" src="../../static/huachi.gif"></image>
			</view>
			<view class="center-list">
				<view class="center-list-item center-list-item-user">
					{{ name }}
				</view>
				<view class="center-list-item center-list-item-user-info">
					{{ email }}
				</view>
			</view>
		</view>		
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="handleSwitchServ">
				<image class="list-item-icon" src="../../static/IP.png"></image>
				<text class="list-text">{{ $t("lang.ot.app.serverConfig") }}</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="handleBeep">
				<image class="list-item-icon" src="../../static/beep.png"></image>
				<text class="list-text">通用设置</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import i18n from '@/i18n/index.js';

	export default {
		data() {
			return {}
		},
		computed: {
			...mapState(['email', 'name', 'telephone', 'lang']),
		},
		onShow() {
		},
		onReady() {
		},
		methods: {
			...mapMutations(['updateState', 'updateLang']),
			handleSwitchLang() {
				const lang = this.lang === 'zh' ? 'en' : 'zh';
				this.updateLang(lang);
				this.$setTitle('lang.ot.app.mine');
			},
			handleBeep() {
				uni.navigateTo({
					url: `/pages/views/setting/beep`,
				})
			},
			handleSwitchServ() {
				uni.navigateTo({
					url: `/pages/login/servconfig`,
				})
			},
			handleLogout() {
				clearInterval(uni.numTimer);
				this.updateState({
					accessToken: '',
					menus: [],
					shouldAutoLogin: false,
				});
				uni.reLaunch({
					url: `/pages/login/login`,
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 个人中心 */

	.center {
		flex-direction: column;
		width: 100%;

		.go-login.navigat-arrow {
			font-size: 38rpx;
			color: #FFFFFF;
		}

		.center-list {
			background-color: #FFFFFF;
			margin-top: 20rpx;
			// flex: 1;
			padding: 0 0 0 60rpx;
			flex-direction: column;
		}

		.center-list-item {
			height: 80rpx;
			width: 100%;
			box-sizing: border-box;
			flex-direction: row;
			align-items: center;
		}

		.border-bottom {
			border-bottom-width: 1rpx;
			border-color: #c8c7cc;
			border-bottom-style: solid;
		}

		.list-icon {
			width: 40rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 26rpx;
			color: rgb(24, 144, 255);
			text-align: center;
			font-family: texticons;
			margin-right: 20rpx;
		}

		.list-text {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 26rpx;
			color: #555;
			flex: 1;
			text-align: left;
		}

		.navigat-arrow {
			height: 80rpx;
			width: 40rpx;
			line-height: 80rpx;
			font-size: 26rpx;
			color: #555;
			text-align: right;
			font-family: texticons;
		}

		.center-user-pic {
			width: 200rpx;
			height: 200rpx;
			margin: 40rpx;
		}

		.center-list-item-user {
			flex: 1;
			align-items: center;
			font-size: 60rpx; 
			font-weight: bold
		}

		.center-list-item-user-info {
			color: #ccc;
			font-size: 30rpx;
		}

		.list-item-icon{
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
			position: absolute;
			left: 10rpx;
		}
		
	}
</style>
