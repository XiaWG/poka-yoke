<template>
  <view style="flex-direction: column; flex: 1">
    <view class="body"> 
      <view class="scanBox">
        <input
          class="scanInput"
          :value="scanNumber"
          @confirm="(e) => handleGetScanData(e.target.value)"
          :placeholder="placeholder"
          :focus="autoFocus"
          @focus="changeFocus"
          :auto-blur="false"
        />
        <uni-icons
          type="scan"
          class="scan"
          size="40"
          @click="handleScan('productLine')"
        />
      </view>

      <view class="title">
        线体: {{ productLine || '--' }}
      </view>
      <view class="title">
        产品名称: {{ productName || '--' }}
      </view>
    </view>    
    
    <view class="footer">
      <button class="button" @click="reset">
        <image
          class="icon" 
          src='../../../static/icon/replace.png'
        />
        重置
      </button>
    </view>
  </view>
</template>

<script>
import { checkGrant, checkProgramExist } from "@/api/api.js";
export default {
  data () {
    return {
      autoFocus: false,
      programId: '',
      productLine: '',
      productName: '',
      loginUser: [],
      curInput: 1,
      scanNumber: '',
    };
  },
  onShow() {
    const ext = this.$store.state.ext
    if (ext.programId && ext.productName && ext.productLine) {
      this.goToPage(`/pages/views/ext/main?programId=${ext.programId}&name=${ext.productName}&productLine=${ext.productLine}`)
    } else {
      setTimeout(() => {
        this.focus()
      }, 100)
    }
  },
  computed: {
    placeholder () {
      return this.curInput === 1 ? '请选择或扫描线体' : this.curInput === 2 ? '请登记或扫描产品名称' : '请扫描登录账号'      
    }    
  },
  watch: {
    loginUser (v) {
      if(v.length === 1) {
        this.goToPage(`/pages/views/provideError/main?programId=${this.programId}&name=${this.productName}&productLine=${this.productLine}&user=${JSON.stringify(v)}`)
        this.reset()
      }
    }
  },
  
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
	},
  methods: {
    focus () {
      this.autoFocus = false
      this.$nextTick(() => {
        this.autoFocus = true
      })
    },
    changeFocus () {
      //#ifdef APP-PLUS
      // if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    async handleGetScanData (data, name) {
      this.scanNumber = data
      data = data.trim()
      this.$nextTick(() => {
        this.scanNumber = ''
      })
      if (!data) {
        uni.showToast({
          title: '扫描数据为空',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      if (this.curInput === 1) { // 线体
        this.productLine = data
        this.curInput ++
        return
      } else if (this.curInput === 2) {
        this.productName = data

        // 校验线体 产品
        uni.showLoading()
        const res = await checkProgramExist({
          programName: this.productName,
          lineName: this.productLine
        }).catch(res => {
          uni.showModal({
            showCancel: true,
            title: "提示",
            content: res.data.msg,
            success: (res) => {
              if (res.confirm) {
                this.reset()
              }
            },
          })
        }).finally(() => {
          uni.hideLoading()
        })
        if (res && res.code === 0) {
          this.programId = res.data.id
          // 缓存线体信息 下次自动跳转
          this.$store.commit('updateExtState', {
            programId: this.programId,
            productName: this.productName,
            productLine: this.productLine
          })
          this.goToPage(`/pages/views/ext/main?programId=${this.programId}&name=${this.productName}&productLine=${this.productLine}`)
          this.reset()
        }
      } else {
        // 校验登陆人        
      }
    },
    async handleScan () {
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
      this.handleGetScanData('admin')
      // #endif
    },
    
    goToPage(url) {
      uni.reLaunch({
        url,
      })
    },

    reset () {
      this.scanNumber = ''
      this.productLine = ''
      this.productName = ''
      this.loginUser = []
      this.curInput = 1
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
    // background: #fff;
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
  .button::after{
    border: 0;
  }
}
</style>

