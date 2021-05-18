<template>
  <view style="flex-direction: column; flex: 1">
    <view class="body">
      <view class="scanBox">
        <input
          class="scanInput"
          :value="scanNumber"
          :focus="locationFocus"
          :disabled="disable"
          @confirm="(e) => handleGetScanData(e.target.value, 'productName')"
          :placeholder="placeholder"
          @focus="changeFocus"
          :auto-blur="false"
        />
        <uni-icons
          type="scan"
          class="scan"
          size="40"
          @click="handleScan('productName')"
        />
      </view>
      <view class="title">
        产品名称: {{ productName || '--' }}
      </view>
      <view class="login">
        <view class="login-item">
          <image
            class="img"
            src='../../../static/icon/user.png'
          />
          <view class="username">
            {{ (loginUser[0] && loginUser[0].userName) || '未登录'}}
          </view>
        </view>
        <view class="login-item">
          <image
            class="img"
            src='../../../static/icon/user.png'
          />
          <view class="username">
            {{ (loginUser[1] && loginUser[1].userName) || '未登录'}}
          </view>
        </view>
      </view>
      
    </view>
    
    <view 
      class="footer"
    >
      <span class="button" @click="reset">
        <image
          class="icon" 
          src='../../../static/icon/replace.png'
        />
        重置
      </span>
    </view>
  </view>
</template>

<script>
import { checkGrant } from "@/api/api.js";
export default {
  data() {
    return {
      productName: '',
      locationFocus: false,
      loginUser: [],
      scanNumber: '',
      curInput: 1,
      disable: false,
      showKeyboard: false,
      option: {}
    };
  },
  onShow() {
    
  },
  
  onLoad (option) {
    this.option = option
    if (option.programId) {
      this.handleGetScanData(option.programName)
    }
  },

  computed: {
    placeholder () {
      return this.curInput === 1 ? '请登记或扫描产品名称' : '请扫描登录账号'
      // return this.curInput === 1 ? '清扫描线体' : this.curInput === 2 ? '请登记或扫描产品名称' : '请扫描登录账号'
    }
  },
  watch: {
    loginUser (v) {
      if(v.length === 2) {
        let url = `/pages/views/info/infoCollectMain?name=${this.productName}&user=${JSON.stringify(v)}`
        if (this.option.programId) {
          url += `&programId=${this.option.programId}&curLine=${this.option.curLine}`
        }
        this.goToPage(url)
        this.reset()
      }
    }
  },
  onNavigationBarButtonTap(e) {
    this.showKeyboard = !this.showKeyboard
    uni.showToast({
      title: this.showKeyboard ? '键盘开启' : '键盘关闭',
      duration: 5000,
      icon: "none",
    })
    this.changeFocus()
	},
  methods: {
    changeFocus () {
      //#ifdef APP-PLUS
      if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    handleGetScanData (data) {
      this.scanNumber = data
      this.$nextTick(() => {
        this.scanNumber = ''
      })
      if (this.curInput === 1) { // 产品
        this.productName = data
        this.curInput ++
        return
      }
      // 校验登陆人
      uni.showLoading()
      checkGrant({
        grantCode: data
      }).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
          if (this.loginUser.length > 0) {
            if (res.data.loginName === this.loginUser[0].loginName) {
              uni.showToast({
                title: '登录的账号不能是同一个人',
                duration: 2000,
                icon: "none",
              })
              return false
            }
          }
          this.loginUser.push({
            loginName: res.data.loginName,
            userName: res.data.userName
          })
        }
      }).catch(() => {})
    },
    handleScan () {
      // #ifdef APP-PLUS
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
        success: (res) => {
          this.handleGetScanData(res.result)
        },
        fail: (res) => {
          uni.showToast({
            title: '扫描失败',
            duration: 2000,
            icon: "none",
          })
        }
      })
      // #endif
      // #ifdef H5
      this.handleGetScanData('admin', name)
      // #endif
    },
    goToPage(url) {
      uni.navigateTo({
        url,
      })
    },
    reset () {
      this.scanNumber = ''
      this.loginUser = []
      if (this.option.programId) {
        this.curInput = 2
      } else {
        this.productName = ''
        this.curInput = 1
      }      
    }
  },
};
</script>

<style lang="scss">
.login{
  flex-direction: row;
  margin-top: 50px;
}
.login-item{
  height: 100px;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  

  .img{
    height: 50px;
    width: 50px;
  }

  .username{
    line-height: 50px;
  }
}
.title{
  background: #fff;
  flex-direction: column;
  padding: 30rpx 10rpx;
  border-left: 20rpx solid #808ce3;
  // font-weight: bold;
  border-bottom: 1px solid #ccc;
}
.scanBox{
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  background: #fff;
  line-height: 100rpx;
}
.scanInput{
  height: 100rpx;
  flex: 1;
  padding: 0 10rpx;
}
.scan {
  
}

.row{
  flex: 1;
  margin: 20rpx 0;
  padding: 0 20rpx;
}
.label{
  width: 200rpx;
  text-align: right;
  justify-content: flex-end;
  height: 100rpx;
  line-height: 100rpx;
  padding-right: 20rpx;
  font-size: 30rpx;
}
.value{
  flex-grow: 1;
}
.value input{
  flex: 1;
  border-bottom: 1px solid #ccc;
  height: 100rpx;
}

.body{
  flex-grow: 1;
  flex-direction: column;
}

.footer{
  flex-grow: 0;
  border-top: 1px solid #ccc;

  .button{
    background: #fff;
    border: 0;
    border-radius: 0;
    flex: 1;
    text-align: center;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 35rpx;
    font-weight: normal;

    .icon{
      width: 40rpx;
      height: 40rpx;
      vertical-align: middle;
      margin-right: 20rpx;
    }
  }
}
</style>

