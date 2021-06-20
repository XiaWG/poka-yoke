<template>
  <view style="display: flex;flex-direction: column; flex: 1">
    <view class="header">
      <view class="scanBox">
        <input
          class="scanInput"
          :value="scanNumber"
          :focus="autoFocus"
          :disabled="disable"
          @confirm="(e) => handleGetScanData(e.target.value)"
          :placeholder="placeholder"
          @focus="changeFocus"
          :auto-blur="false"
        />
        <uni-icons
          v-if="!disable"
          type="scan"
          class="scan"
          size="40"
          @click="handleScan('productName')"
        />
      </view>
      <view class="title" style="flex-direction: row">
        <view style="width: 50%">
          线体: {{ lineName || '--' }}
        </view>
        <view style="width: 50%">
          机种: {{ productName || '--' }}
        </view>        
      </view>
    </view>
    <view class="body">
      <scroll-view scroll-x scroll-y>
        <view v-for="(item, index) in times"
          :key="index"
          class="times-item"
        >
          <view style="width: 40%">{{item}}</view>
          <view style="width: 60%">
            <easyinput 
              type="number"
              v-model="row['time' + (index + 1)]"
            />
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view 
      class="footer"
    >
      <button class="button" @click="reset" style="border-right: 1px solid #ccc">
        <image
          class="icon" 
          src='../../../static/icon/replace.png'
        />
        重置
      </button>
      <button class="button" @click="handleSubmit">
        <image
          class="icon" 
          src='../../../static/icon/submit.png'
        />
        提交
      </button>
    </view>
  </view>
</template>

<script>
import { listByProgramAndTime, addAndUpdateProductionInfo } from "@/api/api.js";
import easyinput from "@/components/uni-easyinput/uni-easyinput.vue";
export default {  
  components: {
    easyinput
  },
  data() {
    return {
      lineName: '',
      productName: '',
      autoFocus: true,
      user: '',
      scanNumber: '',
      curInput: 1,
      disable: false,
      option: {},
      row: {}
    };
  },

  computed: {
    times () {
      return [        
        '08:00 ~ 10:00',
        '10:00 ~ 12:00',
        '12:00 ~ 14:00',
        '14:00 ~ 16:00',
        '16:00 ~ 18:00',
        '18:00 ~ 20:00',
        '20:00 ~ 22:00',
        '22:00 ~ 24:00',
        '00:00 ~ 02:00',
        '02:00 ~ 04:00',
        '04:00 ~ 06:00',
        '06:00 ~ 08:00',
      ]
    },
    placeholder () {
      return this.curInput === 1 ? '请录入或扫描线体' : this.curInput === 2 ? '请录入或扫描机种' : this.curInput === 3 ? '请录入或扫描人员' : ''
    }
  },

  onShow() {
    
  },
  
  onLoad (option) {
    this.option = option
  },
  
  watch: {
    
  },
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
	},
  methods: {
    changeFocus () {
      //#ifdef APP-PLUS
      // if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    handleGetScanData (data) {
      this.scanNumber = data
      this.$nextTick(() => {
        this.scanNumber = ''
      })
      if (this.curInput === 1) {
        this.lineName = data
        this.curInput = 2
      } else if (this.curInput === 2) {
        this.productName = data
        this.disable = true
        this.curInput = 9
        uni.showLoading()
        listByProgramAndTime({
          programId: data
        }).then(res => {
          uni.hideLoading()
          this.row = res.rows[0]
        }).catch(() => {
          uni.hideLoading()
          this.reset()
        })        
      } else {
        this.row.createBy = data
        uni.showLoading()
        addAndUpdateProductionInfo(this.row).then(res => {
          uni.hideLoading()
          if (res.code === 0) {
            uni.showToast({
              title: '操作成功',
              duration: 2000,
              icon: "none",
            })
            this.reset()
          }
        }).catch(() => {})
      }      
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
      uni.reLaunch({
        url,
      })
    },
    reset () {
      this.scanNumber = ''
      this.lineName = ''
      this.productName = ''
      this.disable = false
      this.curInput = 1
      this.row = {}
      this.focus()
    },

    handleSubmit () {
      console.log(this.row)
      if (this.lineName && this.productName) {
        this.disable = false
        this.curInput = 3
        this.focus()
      } else {
        uni.showToast({
          title: '请输入线体和机种',
          duration: 2000,
          icon: "none",
        })
        this.focus()
      }
    },

    focus () {
      this.autoFocus = false
      this.$nextTick(() => {
        this.autoFocus = true
      })
    },
  },
};
</script>

<style lang="scss">
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

.header{
  height: 250rpx;
  overflow: hidden;
  background: #fff;
  flex-direction: column;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;

  .times-item{
    background: #fff;
    padding: 10rpx;
    line-height: 60rpx;
    border-bottom: 1px solid #ccc;
  }
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
