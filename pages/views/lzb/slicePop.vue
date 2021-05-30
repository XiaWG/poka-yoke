<template>
  <view style="display: flex; flex: 1;flex-direction: column">
    <view class="header title">
      条码截取 {{ userName ? `-` + userName : ''}}
    </view>
    <view v-if="!logined" style="flex-direction: column; padding: 20px;">
      <view class="row">
        <input type="text" class="login-input" placeholder="请输入账号" v-model.trim="user.userName">
      </view>
      <view class="row">
        <input type="password" class="login-input" placeholder="请输入密码" v-model.trim="user.password">
      </view>
      <view class="row">
        <button type="warn" size="default" style="width:100%" @click="handleClose">
          取消
        </button>
        <button type="primary" size="default" style="width:100%" @click="handleLogin">
          确认
        </button>
      </view>
    </view>
    <view v-else class="body">
      <view class="slice-box">
        <span
          v-for="(item, index) in sliceTm"
          :key="index"
          :class="['slice-item', sliceItems.includes(index) ? 'slice-sel' : '']"
          @click="handleSliceItem(index)"
        >
          {{ item }}
        </span>
      </view> 
    </view>
    <view v-if="logined" class="footer">
      <button type="warn" size="default" style="width:100%" @click="handleClose">
        取消
      </button>
      <button type="primary" size="default" style="width:100%" @click="handleSlice">
        确认
      </button>
    </view>
  </view>
</template>

<script>
import { updateProgramDetailBeforeCheckUser, updateProgramDetailById } from '@/api/api.js'
export default {
  props: {
    model: Object,
    slice_user: Object
  },
  data () {
    return {
      user: {
        userName: '',
        password: ''
      },
      logined: false,
      userName: '',
      sliceItems: [],
      slicePos: 0,
      sliceTms: ''
    }
  },
  computed: {
    sliceTm () {
      return this.model.originalBarcode.split('')
    },
    sliceIndex () {
      const r = [-1, -1]
      if (this.model.startLocation >= 0) {
        r[0] = this.model.startLocation
      }
      if (this.model.endLocation >= 0) {
        r[1] = this.model.endLocation
      }
      return r
    }
  },
  mounted () {
    if (this.slice_user.loginName) {
      this.logined = true
      this.userName = this.slice_user.userName
    }
    this.sliceItems = []
    for (var i = this.sliceIndex[0]; i <= this.sliceIndex[1]; i++) {
      this.sliceItems.push(i)
    }
    this.sliceTms = this.sliceTm.slice(this.sliceIndex[0], this.sliceIndex[1] + 1).join('')
  },
  methods: {
    handleSliceItem (index) {
      if (this.slicePos == 0) {
        this.sliceIndex[0] = index
        this.sliceIndex[1] = index
      }
      if (this.slicePos == 1) {
        this.sliceIndex[1] = index
      }
      this.slicePos ++
      if (this.slicePos > 1) {
        this.slicePos = 0
      }
      this.sliceItems = []
      for (var i = this.sliceIndex[0]; i <= this.sliceIndex[1]; i++) {
        this.sliceItems.push(i)
      }
      this.sliceTms = this.sliceTm.slice(this.sliceIndex[0], this.sliceIndex[1] + 1).join('')
    },
    handleClose () {
      this.$emit('close')
    },
    handleLogin () {
      if (!this.user.userName || !this.user.password) {
        uni.showToast({
          title: '请输入账号密码',
          duration: 2000,
          icon: "none",
          position: 'top'
        })
        return
      }
      uni.showLoading()
      updateProgramDetailBeforeCheckUser({
        userName: this.user.userName,
        password: this.user.password
      }).then(res => {
        if (res && res.code === 0) {
          this.$emit('login', res.data)
          this.logined = true
          this.userName = res.data.userName
        }        
      }).finally(() => {
        uni.hideLoading()
      })
    },

    handleSlice () {
      if (!this.sliceTms) {
        uni.showToast({
          title: '请选择截取位置',
          duration: 2000,
          icon: "none",
          position: 'top'
        })
        return
      }
      uni.showLoading()
      updateProgramDetailById({
        programDetailId: this.model.id,
        partCode: this.model.originalBarcode,
        userName: this.slice_user.loginName,
        isSubstr: "1",
        startLocation: this.sliceIndex[0],
        endLocation: this.sliceIndex[1],
        substrBarcode: this.sliceTms
      }).then(res => {
        if (res && res.code === 0) {
          uni.showToast({
            title: '操作成功',
            duration: 2000,
            icon: "none",
            position: 'top'
          })
          this.$emit('refresh')
          this.handleClose()
        }
      }).finally(() => {
        uni.hideLoading()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.login-input{
  border: 1px solid #ccc;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
}
.scanBox{
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  background: #fff;
  line-height: 80rpx;
  height: 80rpx;
}
.scanInput{
  height: 80rpx;
  flex: 1;
  padding: 0 10rpx;
}
.title{
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  flex-direction: column;
  padding: 0 10rpx;
  border-left: 20rpx solid #808ce3;
  border-bottom: 1px solid #ccc;
  font-weight: bold;

  .btn{
    position: absolute;
    right: 0;
    background: #1890ff;
    width: 50px;
    height: 78rpx;
    text-align: center;
    color: #fff;
    justify-content: center;
    font-size: 15px;
  }
}
.btn button{
  margin: 10rpx;
}
.active {
  background: #f5f5f5
}

.row{
  flex: 1;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
}
.pop_title{
  border-bottom: 1px solid #ccc; 
  justify-content: center; 
  padding: 20rpx;
  font-size: 40rpx;
}
.label{
  width: 150rpx;
  justify-content: flex-end;
  height: 50rpx;
  line-height: 50rpx;
  padding-right: 30rpx;
}
.value{
  flex-grow: 1;
}
.value input{
  flex: 1;
  // border-bottom: 1px solid #ccc;
  height: 50rpx;
  padding: 10rpx;
  font-size: 30rpx;
}
.header{
  height: 80rpx;
  overflow: hidden;
  background: #fff;
  flex-direction: column;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background: #fff;
  padding: 0 10rpx;
}

.footer{
  height: 80rpx;
  border-top: 1px solid #ccc;
  box-sizing: border-box;

  .button{
    // background: #fff;
    border: 0;
    border-radius: 0;
    flex: 1;
    text-align: center;
    height: 80rpx;
    font-size: 30rpx;
    font-weight: normal;
    padding: 14rpx;
    box-sizing: border-box;

    .icon{
      width: 40rpx;
      height: 40rpx;
      vertical-align: middle;  
      margin-right: 10rpx;  
    }
  }

  .button::after{
    border: 0;
  }
}

.table-icon{
  width: 40rpx;
  height: 40rpx;
  margin: 0 10rpx;
}

.slice-box {
  display: block;
  overflow: auto;

  .slice-item{
    float: left;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 2px;
  }

  .slice-sel{
    background: blue;
    color: #fff;
  }
}
</style>

