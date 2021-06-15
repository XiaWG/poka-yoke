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
  <view class="list-item" style="justify-content: space-between;">
    接料提醒时长(min)
    <span
      style="display: inline-block; width: 100px"
    >
      <easyinput
        type="number"
        v-model="beepInterval"
        placeholder="请输入"
        :clearable="false"
        @input="handleSetBeepInterval"
      />
    </span>
    
  </view>
</view>
  
</template>

<script>
import easyinput from "@/components/uni-easyinput/uni-easyinput.vue";
export default {
  data () {
    return {
      beepNum: 0,
      beepInterval: 60000
    }
  },
  components: {
    easyinput
  },
  mounted () {
    this.beepNum = this.$store.state.beepNum
    this.beepInterval = this.$store.state.beepInterval / 60000
  },
  watch: {
    
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
    },
    handleSetBeepInterval (v) {
      if (v <= 0) {
        uni.showToast({
          title: '请输入大于0的正数',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      this.$store.commit("SETBEEPINTERVAL", v * 60 * 1000)
    }
  },
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
	},
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
  border-bottom: 1px solid #ccc
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
