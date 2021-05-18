<template>
  <view class="menu">
	  <view style="flex-direction: column; align-items: center;margin-bottom:60px">
		  <image class="center-user-pic" src="../../../static/IP.png"></image>
	  </view>
    <view class="menu_list">
      <view class="menu_item" @click="goToPage('/pages/views/setting/roomName')">
        仓库名称
      </view>
      <view class="menu_item" @click="goToPage('/pages/views/setting/prameOrder')">
        物料参数排序
      </view>
      <view class="menu_item" @click="goToPage('/pages/views/setting/beep')">
        蜂鸣设置
      </view>
      <!-- <view class="menu_item" @click="goToPage('/pages/views/setting/permision')">
        权限
      </view> -->
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      
    };
  },
  onShow() {
    
  },
  computed: {
    
  },
  methods: {
    goToPage(url) {
      uni.navigateTo({
        url,
      })
    }
  },
};
</script>

<style lang="scss">
.menu {
  flex-direction: column;
  padding: 0 10rpx;
  width: 100%;
  justify-content: center;

  .center-user-pic{
    width: 200rpx;
    height: 200rpx;
  }

  .menu_list{
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    padding: 40rpx;
    border: 1px solid #ccc;
    border-radius: 20rpx;
  }

  .menu_item{
    background: #13227a;
    color: #fff;
    padding: 20rpx;
    justify-content: center;
    border-radius: 10rpx;
    width: 45%;
    margin: 10rpx 0;
  }
}
</style>

