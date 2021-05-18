<template>
  <view class="menu">
	  <view style="flex-direction: column; align-items: center;margin-bottom:60px">
		  <image class="center-user-pic" src="../../../static/IP.png"></image>
	  </view>
    <view class="menu_list">
      <!-- <view class="menu_item" @click="goToPage('/pages/views/info/memberPermision')">
        员工权限
      </view> -->
      <!-- <view class="menu_item">
        线体设定
      </view> -->
      <view class="menu_item" @click="goToPage('/pages/views/info/roomMaterial')">
        仓库物料
      </view> 
      <!-- <view class="menu_item">
        BOM
      </view>  -->
      <view class="menu_item" @click="goToPage('/pages/views/info/materailStationForm')">
        料站表
      </view> 
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
        success: () => {
          // uni.setNavigationBarTitle({
          //   title: `${this.curLabel}`,
          // })
        },
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

