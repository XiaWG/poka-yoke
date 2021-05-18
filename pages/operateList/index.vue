<template>
	<view class="device-list">
		<!-- <view class="device-list__tip">工序列表</view> -->
		<view 
      v-for="(item, index) in list" :key="index" 
      @click="handleSelectOperate(item)" 
      class="device-list__item"
    >
      {{ item.name }}
    </view>
		<view v-if="!list.length" class="no-data">
			{{ $t("lang.ot.app.noData") }}
		</view>
	</view>
</template>

<script>
	import { getOperateList } from '@/api/remote.js'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				list: [],
			}
		},
		created() {
			this.getOperateList()
		},
		onShow() {

		},
		computed: {

		},
		methods: {
			...mapMutations(['updateState']),
			getOperateList() {
        const data = {
          pageNo: 1,
          pageSize: 10000
        }
				getOperateList(data).then(({ data }) => {
          this.list = data.data
        })
			},
			handleSelectOperate(item) {
				this.updateState({
					selectOperate: item,
				})				
				uni.switchTab({
					url: '/pages/menu/menu',
					success: () => { // 切换tab时，未执行onshow事件，手动在跳转成功后修改标题
						uni.setNavigationBarTitle({
							title: item.name,
						})
					}
				})
			}
		}

	}
</script>

<style lang="scss">
	.device-list {
		flex-direction: column;
		width: 750rpx;

		&__tip {
			flex-direction: column;
			font-size: 28rpx;
			line-height: 60rpx;
			padding-left: 30rpx;
			margin-bottom: 20rpx;
		}

		&__item {
			height: 50rpx;
			line-height: 50rpx;
			padding-left: 30rpx;
			border-bottom: 1px solid #ddd;
			flex-direction: column;
			width: 100%;
			font-size: 20rpx;

		}
	}
</style>
