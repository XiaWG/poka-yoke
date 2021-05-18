<template>
	<view class='login'>
		<view class='login__form'>
			<view class="input-wrapper">
				<view class="label-view">
					<text class="label">
						{{ $t('lang.ot.app.oldPassword') }}
					</text>
				</view>
				<input 
					class="input" 
					style="padding-left: 16rpx;" 
					type="password" 
					:value="formData.oldPwd" 
					:placeholder="$t('lang.ot.app.pleaseEnterYourPassword')"
				 	@input="handleInput($event, 'oldPwd')" />
			</view>
			<view class="input-wrapper">
				<view class="label-view">
					<text class="label">
						{{ $t('lang.ot.app.newPassword') }}
					</text>
				</view>
				<input 
					class="input" 
					style="padding-left: 16rpx;" 
					type="password" 
					:value="formData.newPwd" 
					:placeholder="$t('lang.ot.app.pleaseEnterYourPassword')"
				 	@input="handleInput($event, 'newPwd')" />
			</view>
			<view class="input-wrapper">
				<view class="label-view">
					<text class="label">
						{{ $t('lang.ot.app.confirmNewPassword') }}
					</text>
				</view>
				<input 
					class="input" 
					style="padding-left: 16rpx;" 
					type="password" :value="formData.confirmNewPwd" 
					:placeholder="$t('lang.ot.app.pleaseEnterYourPassword')"
				 	@input="handleInput($event, 'confirmNewPwd')" />
			</view>
			<view class="button-wrapper">
				<button type="primary" class="login__submit" @click='handleSubmit' :disabled="loading" :loading="loading">
					{{ $t('lang.ot.app.determine') }}
				</button>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		modifyPwd
	} from '@/api/remote.js';
	import { mapMutations } from 'vuex';

	export default {
		data() {
			return {
				loading: false,
				checks: [],
				formData: {
					username: '',
					password: '',
				},
				autoLogin: false,
				rememberPassword: false,
				userList: [],
				candidates: [],
				deviceList: [],
			};
		},
		computed: {},
		onShow() {
			this.$setTitle(this.$t('lang.ot.app.changePassword'));
		},
		methods: {
			...mapMutations(['updateState']),
			handleInput(event, name) {
				const {
					value
				} = event.detail;
				this.formData[name] = value;
			},
			async handleSubmit() {
				const {
					oldPwd,
					newPwd,
					confirmNewPwd,
				} = this.formData;
				if (!oldPwd) {
					uni.showToast({
						title: this.$t('lang.ot.app.oldPasswordCanNotBeEmpty'),
						duration: 2000,
						icon: 'none',
					});
					return false;
				}
				if (!newPwd || newPwd.length < 6) {
					uni.showToast({
						title: this.$t('lang.ot.app.passwordLessThan6'),
						duration: 2000,
						icon: 'none',
					});
					return false;
				}
				if (!confirmNewPwd || confirmNewPwd.length < 6) {
					uni.showToast({
						title: this.$t('lang.ot.app.passwordLessThan6'),
						duration: 2000,
						icon: 'none',
					});
					return false;
				}
				if (newPwd !== confirmNewPwd) {
					uni.showToast({
						title: this.$t('lang.ot.app.passwordInconsistent'),
						duration: 2000,
						icon: 'none',
					});
					return false;
				}
				this.loading = true;
				uni.showLoading();
				const res = await modifyPwd({
					oldPwd,
					newPwd,
				});
				if (res) {
					uni.showToast({
						title: this.$t('lang.ot.app.successfulOperation'),
						duration: 2000,
						icon: 'none',
					});
					this.updateState({
						accessToken: '',
						menus: [],
						shouldAutoLogin: false,
					});
					uni.reLaunch({
						url: `/pages/login/login`,
					})
				}
				uni.hideLoading();
				this.loading = false;
			},
		},
	}
</script>

<style lang="scss">
	/* 登录 */

	.login {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 750rpx;
		padding-top: 100rpx;

		.input-wrapper {
			border-bottom-style: solid;
			border-bottom-width: 1rpx;
			border-bottom-color: #ddd;
			background-color: #fff;
			flex-direction: row;
			width: 650rpx;
			padding: 20rpx;
			box-sizing: border-box;
			margin-left: 50rpx;
		}

		&__submit {
			width: 100%;
		}

		&__form {
			flex-direction: column;
		}

		.android-id {
			align-items: center;
			flex-direction: column;
		}

		radio-group {
			font-size: 20rpx;
			line-height: 40rpx;

			label {
				margin-right: 16px;
			}
		}

		checkbox-group {
			font-size: 20rpx;
			line-height: 40rpx;

			label {
				margin-right: 16px;
			}
		}
	}



	.label-view {
		width: 120rpx;
		height: 40rpx;
		align-items: center;
		margin-right: 30rpx;
	}

	.label {
		flex: 1;
		line-height: 40rpx;
		font-size: 20rpx;
		color: #555;
		text-align: left;
	}

	.input {
		flex: 1;
		height: 40rpx;
		font-size: 20rpx;
		align-items: center;
	}

	.button-wrapper {
		width: 650rpx;
		margin: 50rpx;
		box-sizing: border-box;
		flex-direction: column;
	}

	.pc {
		.login {
			width: 100%;
			padding-left: 30px;
			padding-right: 30px;

			.input-wrapper {
				width: 100%;
				margin-left: 0;

			}
		}

		.button-wrapper {
			width: auto;
		}
	}
</style>
