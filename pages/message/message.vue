<template>
	<scroll-view scroll-y="true" class="message" @refresherrefresh="getMessageList(true)" @scrolltolower="handelPageChange">
		<view class="message__item" v-for="item in dataList" :key="item.newsId" @click="goToDetail(item)">
			<view style="justify-content: space-between;">
				<view>机台号： {{item.linked.taskOrderPlan.deviceCode}}</view>
				<view>{{item.linked.statusName}}</view>
			</view>
			<view style="margin-top: 10rpx;">异常类型： {{item.linked.callTypeName}}</view>
			<view style="font-size: 20rpx; color: #999;margin-top: 10rpx;">创建时间： {{item.createTime}}</view>
		</view>
	</scroll-view>
</template>

<script>
	import {
		getMessageList,
		newsRead
	} from '@/api/remote.js';
	export default {
		name: 'message',
		data() {
			return {
				dataList: [],
				loading: false,
				pageNo: 1,
				pageSize: 10,
				total: 0,
			}
		},
		onReady() {
		},
		onShow() {
    	this.$setTitle("lang.ot.app.news");
			this.getMessageList(true);
		},
		created() {
			// this.getMessageList(true)
		},
		methods: {
			async getMessageList(isReset = true, callback) {
				return
				if (!isReset && this.total && this.total < this.pageNo * this.pageSize) {
					return false;
				}
				this.loading = true;
				uni.showLoading();
				const res = await getMessageList({
					pageNo: isReset ? 1 : this.pageNo,
					pageSize: this.pageSize,
				})
				if (res) {
					this.dataList = res.records;
					this.total = res.total;
					if (res.records.length) {
						uni.setTabBarBadge({
							index: 0,
							text: String(res.records.length),
						})
					} else {
						uni.removeTabBarBadge({
							index: 0,
						})
					}
				} else {
					this.pageNo = isReset ? 1 : --this.pageNo;
					uni.removeTabBarBadge({
						index: 0,
					})
				}
				callback && callback();
				this.loading = false;
				uni.hideLoading()
			},
			handelPageChange() {
				this.pageNo += 1;
				this.getMessageList();
			},
			goToDetail(item) {
				uni.navigateTo({
					url: `/pages/views/v14-2?id=${item.linkedId}&type=submit`,
				});
			}
		},
		onPullDownRefresh() {
			this.getMessageList(true, () => {
				uni.stopPullDownRefresh();
			});
		},
		onNavigationBarButtonTap() {
			this.getMessageList(true);
		}
	}
</script>

<style lang="scss">
	.message {
		width: 750rpx;
		flex-direction: column;
		background-color: #efefef;

		&__item {
			margin-bottom: 16rpx;
			border-bottom: 1px solid #ddd;
			border-top: 1px solid #ddd;
			flex-direction: column;
			padding: 16rpx;
			background-color: #fff;
			font-size: 24rpx;
		}
	}
</style>
