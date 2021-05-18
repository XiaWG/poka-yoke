<template>
	<view class="t-th" :style="{
	  'border-width': thBorder + 'px' ,
    'border-color':borderColor,
    'font-size':fontSize+'px' ,
    'color':color,
    'justify-content':thAlignCpd,
    'flex': width,
	}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			align: String,
			width: {
				default: 1,
				type: Number
			}
		},
		data() {
			return {
				thBorder: '1',
				borderColor: '#d0dee5',
				fontSize: '15',
				color: '#3b4246',
				thAlign: 'left'
			};
		},
		inject: ['table', 'tr'],

		created() {
			this.thBorder = this.table.border;
			this.borderColor = this.table.borderColor;
			this.fontSize = this.tr.fontSize;
			this.color = this.tr.color;
			if (this.align) {
				this.thAlign = this.align;
			} else {
				this.thAlign = this.tr.align
			}
		},

		computed: {
			thAlignCpd() {
				let nameAlign = '';
				switch (this.thAlign) {
					case 'left':
						nameAlign = 'flex-start'
						break;
					case 'center':
						nameAlign = 'center'
						break;
					case 'right':
						nameAlign = 'flex-end'
						break;
					default:
						nameAlign = 'flex-start'
						break;
				}
				return nameAlign
			}
		}
	};
</script>

<style lang="scss">
	.t-th {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		// font-weight: bold;
		text-align: center;
		color: #000;
		// border-left: 1px #d0dee5 solid;
		// border-top: 1px #d0dee5 solid;
		border-bottom: 1px solid #ccc;
		background: #fff;
		padding: 20rpx 16rpx;
		width: 0;
		word-break: break-all;
		position: relative;
		&:last-child{
			// border-right: 1px solid #d0dee5;
		}
	}
</style>
