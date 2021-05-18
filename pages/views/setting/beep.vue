<template>
<view class="list">
  <view class="list-item">
    蜂鸣次数
    <view style="position: absolute; top: 10px; right: 10px">
      <span class="beep-btn" @click="reduce">-</span>
      <span class="beep-num">{{ beepNum }}</span>
      <span class="beep-btn" @click="add">+</span>
    </view>
  </view>
</view>
  
</template>

<script>
export default {
  data () {
    return {
      beepNum: 0
    }
  },

  mounted () {
    this.beepNum = this.$store.state.beepNum
  },

  methods: {
    reduce () {
      if (this.beepNum <= 1) {
        return
      }
      this.beepNum --
      this.$store.commit("SETBEEP", this.beepNum)
    },
    add () {
      this.beepNum ++
      this.$store.commit("SETBEEP", this.beepNum)
    }
  }
}
</script>

<style scoped>
.list{
  display: flex;
  flex-direction: column;
  flex: 1
}
.list-item{
  background: #fff;
  padding: 20rpx 10rpx;
  height: 50px;
}

.beep-btn{
  border: 1px solid #ccc;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  text-align: center;
  border-radius: 5px;
}

.beep-num{
  border: 1px solid #ccc;
  width: 40px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 10px;
}
</style>
