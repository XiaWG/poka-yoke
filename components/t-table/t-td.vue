<template>
	<view class="t-td" :style="{ 
		'border-width': thBorder + 'px',
		'border-color':borderColor ,
		'font-size':fontSize+'px' ,
		'color':color,
		'justify-content':tdAlignCpd,
    'flex': width}">
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
				fontSize: '14',
				color: '#555c60',
				tdAlign: 'left'
			};
		},
		inject: ['table', 'tr'],

		created() {
			this.thBorder = this.table.border;
			this.borderColor = this.table.borderColor;
			this.fontSize = this.tr.fontSize;
			this.color = this.tr.color;
			if (this.align) {
				this.tdAlign = this.align;
			} else {
				this.tdAlign = this.tr.align
			}
		},
		computed: {
			tdAlignCpd() {
				let nameAlign = '';
				switch (this.tdAlign) {
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
	.t-td {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 0;
		padding: 8rpx 16rpx;
		// border-left: 1px #d0dee5 solid;
		border-bottom: 1px solid #ccc;
		text-align: left;
		color: #000;
		font-size: 25rpx;
		word-break: break-all;
		min-height: 60rpx;
		&:last-child{
			// border-right: 1px solid #d0dee5;
		}
		&.red {
			color: red;
		}
	}

	/deep/ {
		.link {
			color: #1890ff;
			text-decoration: underline;
		}
		input{
			border: 1px solid #eee;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 24rpx;
		}
	}
</style>
