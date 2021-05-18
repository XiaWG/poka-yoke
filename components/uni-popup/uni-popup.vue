<template>
	<view v-show="showPopup" class="uni-popup" :class="[popupstyle]" @touchmove.stop.prevent="clear">
		<uni-transition 
			v-if="maskShow" 
			:mode-class="['fade']" 
			:styles="maskClass" 
			:duration="duration" 
			:show="showTrans"
		 	@click="onTap" />
		<uni-transition 
			:mode-class="ani" 
			:styles="transClass" 
			:duration="duration" 
			:show="showTrans" 
			@click="onTap"
			@change="handleChange">
			<view 
				:class="[contentStyle]" 
				@click.stop="clear"
			>
				<slot />
			</view>
		</uni-transition>
	</view>
</template>

<script>
	import uniTransition from '../uni-transition/uni-transition.vue'
	import popup from './popup.js'
	/**
	 * PopUp 弹出层
	 * @description 弹出层组件，为了解决遮罩弹层的问题
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} type = [top|center|bottom] 弹出方式
	 * 	@value top 顶部弹出
	 * 	@value center 中间弹出
	 * 	@value bottom 底部弹出
	 * 	@value message 消息提示
	 * 	@value dialog 对话框
	 * 	@value share 底部分享示例
	 * @property {Boolean} animation = [ture|false] 是否开启动画
	 * @property {Boolean} maskClick = [ture|false] 蒙版点击是否关闭弹窗
	 * @event {Function} change 打开关闭弹窗触发，e={show: false}
	 */

	export default {
		name: 'UniPopup',
		components: {
			uniTransition
		},
		props: {
			// 开启动画
			animation: {
				type: Boolean,
				default: true
			},
			maskShow: {
				type: Boolean,
				default: true
			},
			// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
			// message: 消息提示 ; dialog : 对话框
			type: {
				type: String,
				default: 'center'
			},
			// maskClick
			maskClick: {
				type: Boolean,
				default: true
			}
		},
		provide() {
			return {
				popup: this
			}
		},
		mixins: [popup],
		watch: {
			/**
			 * 监听type类型
			 */
			type: {
				handler: function(newVal) {
					this[this.config[newVal]]()
				},
				immediate: true
			},
			/**
			 * 监听遮罩是否可点击
			 * @param {Object} val
			 */
			maskClick(val) {
				this.mkclick = val
			}
		},
		data() {
			return {
				duration: 3000,
				ani: [],
				showPopup: false,
				showTrans: false,
				maskClass: {
					'position': 'fixed',
					'bottom': 0,
					'top': 0,
					'left': 0,
					'right': 0,
					'backgroundColor': 'rgba(0, 0, 0, 0.4)'
				},
				transClass: {
					'position': 'fixed',
					'left': 0,
					'right': 0,
				},
				contentStyle: 'uni-popup__wrapper-box',
				mkclick: true,
				popupstyle: 'top'
			}
		},
		created() {
			this.mkclick = this.maskClick
			if (this.animation) {
				this.duration = 300
			} else {
				this.duration = 0
			}
		},
		methods: {
			clear(e) {
				// TODO nvue 取消冒泡
				e.stopPropagation()
			},
			open() {
				this.showPopup = true
				this.$nextTick(() => {
					new Promise(resolve => {
						clearTimeout(this.timer)
						this.timer = setTimeout(() => {
							this.showTrans = true
							// fixed by mehaotian 兼容 app 端
							this.$nextTick(() => {
								resolve();
							})
						}, 50);
					}).then(res => {
						// debugger
						// 自定义打开事件
						let type = this.type //=== 'fullScreen' ? 'center' : this.type
						clearTimeout(this.msgtimer)
						this.msgtimer = setTimeout(() => {
							this.customOpen && this.customOpen()
						}, 100)
					})
				})
			},
			close(type) {
				this.showTrans = false
				this.$nextTick(() => {
					let type = this.type //=== 'fullScreen' ? 'center' : this.type
					this.$emit('change', {
						show: false,
						type
					})
					clearTimeout(this.timer)
					// 自定义关闭事件
					this.customClose && this.customClose()
					this.timer = setTimeout(() => {
						this.showPopup = false
					}, 300)
				})
			},
			handleChange(data) {			
				this.$emit('change', {
					show: data.detail,
					type: this.type
				})
			},
			onTap() {
				if (!this.mkclick) return
				this.close()
			},
			/**
			 * 顶部弹出样式处理
			 */
			top() {
				this.popupstyle = 'top'
				this.ani = ['slide-top']
				this.transClass = {
					'position': 'fixed',
					'left': 0,
					'right': 0,
				}
				this.contentStyle = 'uni-popup__wrapper-box'
			},
			/**
			 * 底部弹出样式处理
			 */
			bottom() {
				this.popupstyle = 'bottom'
				this.ani = ['slide-bottom']
				this.transClass = {
					'position': 'fixed',
					'left': 0,
					'right': 0,
					'bottom': 0
				}
				this.contentStyle = 'uni-popup__wrapper-box'
			},
			/**
			 * 中间弹出样式处理
			 */
			center() {
				this.popupstyle = 'center'
				this.ani = ['zoom-out', 'fade']
				this.transClass = {
					'position': 'fixed',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					'flexDirection': 'column',
					/* #endif */
					'bottom': 0,
					'left': 0,
					'right': 0,
					'top': 0,
					'justifyContent': 'center',
					'alignItems': 'center',
				}
				this.contentStyle = 'uni-popup__wrapper-box1'
			},
			/**
			 * 全屏弹出
			 */
			fullScreen() {
				this.popupstyle = 'fullScreen'
				this.ani = ['slide-bottom']
				this.transClass = {
					'position': 'fixed',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					'flexDirection': 'column',
					/* #endif */
					'bottom': 0,
					'left': 0,
					'right': 0,
					'top': 0,
					'justifyContent': 'center',
					'alignItems': 'center'
				}
				this.contentStyle = 'uni-popup__wrapper-box2'
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup {
		position: fixed;
		/* #ifndef APP-NVUE */
		z-index: 1000;
		/* #endif */
	}

	.uni-popup__mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: $uni-bg-color-mask;
		opacity: 0;
	}

	.mask-ani {
		transition-property: opacity;
		transition-duration: 0.2s;
	}

	.uni-top-mask {
		opacity: 1;
	}

	.uni-bottom-mask {
		opacity: 1;
	}

	.uni-center-mask {
		opacity: 1;
	}

	.uni-popup__wrapper {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
	}

	.top {
		/* #ifndef H5 */
		top: var(--window-top);
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
	}

	.bottom {
		bottom: 0;
	}

	.uni-popup__wrapper-box {
		flex: 1;
		height: 500px;
		background-color: #fff;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: relative;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.uni-popup__wrapper-box1 {
		min-width: 80%;
		max-width: 90%;
		background-color: #fff;
		border-radius: 20rpx;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: relative;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.uni-popup__wrapper-box2 {
		width: 100%;
		flex: 1;
		height: 500px;
		background-color: #fff;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: relative;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.content-ani {
		// transition: transform 0.3s;
		transition-property: transform, opacity;
		transition-duration: 0.2s;
	}


	.uni-top-content {
		transform: translateY(0);
	}

	.uni-bottom-content {
		transform: translateY(0);
	}

	.uni-center-content {
		transform: scale(1);
		opacity: 1;
	}
</style>
