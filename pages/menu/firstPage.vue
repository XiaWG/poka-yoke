<template>
  <view style="flex:1; flex-direction: column">
    <view class="main">
      <image 
        class="img"
        src="../../static/image/soft.png"
      />
      <view class="text">
        信息创造管理之美
      </view>
    </view>    
    <view class="bot">
      <view class="text" style="font-size:24rpx;">
        {{ bot_1 }}
      </view>
      <view class="text" style="font-size:30rpx;">
        {{ bot_2 }}
      </view>
    </view>    
  </view>
</template>

<script>
export default {
  data() {
    return {
      bot_1: 'Poka-Yoke PDA powered by SoftTech Information Technology',
      bot_2: '防错PDA@由苏州索孚泰克信息技术有限公司服务'
    };
  },
  onShow() {
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/menu/menu',
      })
    }, 3000)
  },
  onReady() {

  },
  computed: {
    
  },
  methods: {
    
  }, 
};
</script>

<style lang="scss" scoped>
.main{
  flex: 1;
  flex-direction: column;
  justify-content: center;

  .img{
    width: 95%;
    height:100rpx;
    margin: 10rpx auto;
  }

  .text{
    font-size: 65rpx;
    justify-content: flex-end;
    padding-right: 10%
  }
}
.bot{
  height: 200rpx;
  flex-direction: column;
  justify-content: center;

  .text{
    justify-content: center;
    text-align: center;
  }
}
</style>
