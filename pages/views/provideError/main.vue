<template>
  <view style="flex-direction: column;flex: 1;box-sizing: border-box;">
    <view class="header">
      <view class="scanBox" :style="{background: tempLock ? '#ccc' : ''}">
        <input
          ref="input"
          :disabled="tempLock"          
          class="scanInput"
          :value="number"
          :placeholder="placeholder"
          :focus="autoFocus"
          @confirm="(e) => handleGetScanData(e.target.value)"
          @focus="changeFocus"
          :auto-blur="false"
        />
        <uni-icons
          type="scan"
          class="scan"
          size="40"
          @click="handleScan"
        />
      </view>
      <view class="title" style="font-weight: normal;width: 100%; overflow: auto">
        <view style="white-space: nowrap">
          <text v-if="scanedData.lz">料站: {{ scanedData.lz || '--' }}</text>
          <text v-if="scanedData.jptm">旧盘: {{ scanedData.jptm || '--' }}</text>
          <text v-if="scanedData.xptm">新盘: {{ scanedData.xptm || '--' }}</text>
        </view>
      </view>
    </view>

    <view class="body" style="height: 50%">
      <scroll-view scroll-x scroll-y>
        <t-table>
          <t-tr>
            <t-th :width="50">料站</t-th>
            <t-th :width="100">旧盘条码</t-th>
            <t-th :width="100">新盘条码</t-th>
            <t-th :width="50">比对</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="50">{{ item.lz }}</t-td>
              <t-td :width="100">{{ item.jptm }}</t-td>
              <t-td :width="100">{{ item.xptm }}</t-td>
              <t-td :width="50">
                <!-- {{ item.bd ? '√' : 'X' }} -->
                <image
                  class="table-icon" 
                  :src="'../../../static/icon/' + item.bd + '.png'"
                />
              </t-td>
            </t-tr>
          </template>
          <tr v-else style="height:168px">
            <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
          </tr>
        </t-table>
      </scroll-view>
    </view>    
    <view class="title">
      IPQC确认窗口
    </view>
    <view class="body" style="height: 50%">      
      <scroll-view scroll-x scroll-y>
        <t-table>
          <t-tr>
            <t-th :width="50">料站</t-th>
            <t-th :width="100">新盘条码</t-th>
            <t-th :width="100">IPQC确认</t-th>
            <t-th :width="50">比对</t-th>
          </t-tr>
          <template v-if='subList.length'>
            <t-tr v-for="(item, index) in subList" :key="index">
              <t-td :width="50">{{ item.lz }}</t-td>
              <t-td :width="100">{{ item.xptm }}</t-td>
              <t-td :width="100">{{ item.ipqc }}</t-td>
              <t-td :width="50">
                <image
                  v-if="item.bd"
                  class="table-icon" 
                  :src="'../../../static/icon/' + item.bd + '.png'"
                />
              </t-td>
            </t-tr>
          </template>        
          <tr v-else style="height:168px">
            <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
          </tr>
        </t-table>
      </scroll-view>
    </view>

    <view class="footer">
      <template v-if="IPQCLock">
        <button class="button" @click="handleScan">
          <image
            class="icon" 
            src='../../../static/icon/loginIn.png'
          /><br>
          请登入IPQC账号
        </button>
      </template>
      <template v-if="showEng">
        <button class="button" @click="handleScan">
          <image
            class="icon" 
            src='../../../static/icon/loginIn.png'
          /><br>
          请登入工程师账号
        </button>
      </template>
      <template v-if="!showEng && !IPQCLock">
        <button
          class="button"
          style="border-right: 1px solid #ccc"
          @click="loginOut"
        >
          <image
            class="icon" 
            src='../../../static/icon/loginOut.png'
          /><br>
          登出
        </button>
        <!-- <span
          class="button"
          style="border-left: 1px solid #ccc;border-right: 1px solid #ccc"
          @click="IPQCLogin('jintao')"
        >
          <image
            class="icon" 
            src='../../../static/icon/search-check.png'
          /><br>
          IPQC巡检
        </span> -->
        <button
          class="button"
          @click="handleSubmit"
        >
          <image
            class="icon" 
            src='../../../static/icon/submit.png'
          /><br>
          提交
        </button>
      </template>
    </view>
  </view>
</template>

<script>
import Voice from '@/utils/voice.js';
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import { materialInspectScan, materialInspectIPQCScan, checkGrantIsEngineer, checkGrantIsIPQC, materialScanCheckStation } from '@/api/api.js'
export default {
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
    uniPopupDialog
  },
  data() {
    return {
      option: {},
      number: '',
      tempLock: false,
      mainList: [],
      subList: [],
      form: {
        lz: '',
        jptm: '',
        xptm: '',
        ipqc: '',
        bd: true
      },
      cur: null,
      IPQC: false, // 是否IPQC激活
      curInput: 1, // 1-旧盘条码 2-新盘条码 3-站位
      errNum: 0,
      IPQCInd: -1,
      showEng: false,
      dataNum: 0,
      autoFocus: true,
      IPQCLock: false,
      IPQCUser: null,
      scanedData: {
        lz: '',
        jptm: '',
        xptm: ''
      },
      showKeyboard: false
    };
  },
  onShow() {
    // for (var i =0 ;i< 100; i++) {
    //   this.mainList.push({})
    //   this.subList.push({})
    // }
    this.focus()
  },
  onLoad(option) {
    this.option = option
    this.option.user = JSON.parse(option.user)
  },
  onReady() {
    const title = `生产防错-${this.option.productLine}-${this.option.name}-${this.option.user[0].userName}`
    uni.setNavigationBarTitle({
      title,
    })
  },
  computed: {
    placeholder () {
      let ret = ''
      switch (this.curInput) {
        case 1:
          ret = '请扫描旧盘条码'
          break
        case 2:
          ret = '请扫描站位条码'
          break
        case 3:
          ret = '请扫描新盘条码'
          break
        case 9:
          ret = '请登录账号'
          break
        case 10:
          ret = '请登录账号'
          break
        default:
          ret = ''
      }
      return ret
      // return this.curInput === 1 ? '请扫描旧盘条码' : this.curInput === 2 ? '请扫描站位条码' : '请扫描新盘条码'
    },
    curField () {
      let ret = ''
      switch (this.curInput) {
        case 1:
          ret = 'jptm'
          break
        case 2:
          ret = 'lz'
          break
        case 3:
          ret = 'xptm'
          break
        case 9:
          ret = 'ipqc'
          break
        case 10:
          ret = 'eng'
          break
        default:
          ret = ''
      }
      return ret
      // return this.curInput === 1 ? 'jptm' : this.curInput === 2 ? 'lz' : 'xptm'
    }
  },
  methods: {
    changeFocus () {
      //#ifdef APP-PLUS
      if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    IPQCLogin (data) {
      uni.showLoading()
      checkGrantIsIPQC({
        grantCode: data
      }).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
          this.IPQCUser = res.data.loginName
          this.IPQCLock = false
          this.reset()
        }
      })
    },
    checkGrantIsEngineer (data) {
      uni.showLoading()
      checkGrantIsEngineer({
        grantCode: data
      }).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
          this.showEng = false
          this.reset()
        }
      })
    },
    handleScan () {
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
    },

    async handleGetScanData (value) {
      this.number = value
      value = value.trim()
      this.$nextTick(() => {
        this.number = ''
      })
      if (!value) {
        uni.showToast({
          title: '扫描数据为空',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      if (this.curInput === 9) {
        this.IPQCLogin(value)
        return
      }
      if (this.curInput === 10) {
        this.checkGrantIsEngineer(value)
        return
      }
      this.form[this.curField] = value
      // this.scanedData.lz = ''
      // this.scanedData.jptm = ''
      // this.scanedData.xptm = ''
      this.scanedData[this.curField] = value
      if (!this.IPQC && this.curInput === 2) {
        const res = await materialScanCheckStation({
          programId: this.option.programId,
          stationName: this.form.lz,
        })
        if (!res) {
          this.reset()
          return false
        }      
      }
      if (this.curInput >= 3) { // 输入完毕
        this.tempLock = true
        this.autoFocus = false
        // 调用后台接口
        uni.showLoading()
        const res = this.IPQC ? await materialInspectIPQCScan({
          programId: this.option.programId,
          lineName: this.option.productLine,
          stationName: this.form.lz,
          oldBarcode: this.subList[this.IPQCInd].xptm,
          newBarcode: value,
          createBy: this.IPQCUser
        }) : await materialInspectScan({
          programId: this.option.programId,
          lineName: this.option.productLine,
          stationName: this.form.lz,
          oldBarcode: this.form.jptm,
          newBarcode: this.form.xptm,
          createBy: this.option.user[0].loginName
        })
        uni.hideLoading()
        this.tempLock = false
        if (res && res.code === 0) {
          this.form.bd = 'yes'
        } else if (res && res.code === 301) {
          uni.showModal({
            showCancel: false,
            title: "提示",
            content: res.msg,
            success: (res) => {
              if (res.confirm) {
                this.showLoginEng()
                this.reset()
              }
            },
          })
          return
        } else {
          this.form.bd = 'error'
        }
        if (this.form.bd === 'yes') {
          this.$Voice('../../../static/music/OK.mp3')
          this.errNum = 0
          this.IPQC ? Object.assign(this.subList[this.IPQCInd], this.form) : this.mainList.push({...this.form})
          this.IPQC && this.subList.splice(this.IPQCInd, 1) && this.mainList.splice(this.IPQCInd, 1)
          this.reset()
        } else {
          this.errNum ++
          const content = this.errNum >= 3 ? '录入错误超过限制次数,请工程师解锁确认' : '物料错误，请重新扫描'
          this.IPQC && this.errNum --
          uni.showModal({
            showCancel: false,
            title: "提示",
            content,
            success: (res) => {
              if (res.confirm) {
                if (this.errNum >= 3) {
                  this.errNum = 0
                  this.showLoginEng()
                  // this.mainList.push({...this.form})
                }
                this.reset()
              }
            },
          })
        }
      } else {
        if (this.curInput === 2) {
          const ind = this.mainList.findIndex(d => d.lz === value)
          this.IPQCInd = this.IPQC ? this.subList.findIndex(d => d.lz === value) : -1
          if (!this.IPQC && ind > -1) {
            uni.showToast({
              title: '料站扫描重复,请重新扫描',
              duration: 2000,
              icon: "none",
            })
            return false
          }
          if (this.IPQC && this.IPQCInd === -1) {
            uni.showToast({
              title: '扫描的料站不存在,请重新扫描',
              duration: 2000,
              icon: "none",
            })
            return false
          }
        }
        this.curInput ++
      }
    },

    handleSubmit () {
      this.errNum = 0
      if (this.IPQC) return
      if (!this.mainList.length) {
        uni.showToast({
          title: '没有可提交的数据',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      this.mainList.forEach(d => {
        const _obj = {
          lz: d.lz,
          xptm: d.xptm,
          ipqc: '',
          bd: ''
        }
        this.subList.push(_obj)
      })
      this.curInput = 2
      this.IPQC = true
      this.dataNum = this.mainList.length
      // this.autoFocus = false
      this.IPQCLock = true
      // 登陆账号采用扫描枪 20210516
      this.curInput = 9
      this.scanedData.lz = ''
      this.scanedData.jptm = ''
      this.scanedData.xptm = ''
    },
    
    reset () {
      this.form.lz = ''
      this.form.jptm = ''
      this.form.xptm = ''
      if (this.IPQC && this.mainList.length === 0) {
        uni.showToast({
          title: `确认结束,成功${this.dataNum}盘`,
          duration: 5000,
          icon: "none",
        })
        this.IPQC = false
      }
      this.curInput = this.IPQC ? 2 : 1
      this.focus()
      this.scanedData.lz = ''
      this.scanedData.jptm = ''
      this.scanedData.xptm = ''
    },

    focus () {
      this.$nextTick(() => {
        this.autoFocus = true
      })
    },

    loginOut () {
      uni.showModal({
        showCancel: true,
        title: "提示",
        content: '确认退出嘛?退出后数据将清空!',
        success: (res) => {
          if (res.confirm) {
            uni.reLaunch({
              url: "/pages/menu/menu",
            })
          }
        },
      })      
    },

    goToPage(url) {
      uni.navigateTo({
        url,
      })
    },

    showLoginEng () {
      this.curInput = 10
      // 登陆账号采用扫描枪 20210516
      // this.autoFocus = false
      this.showEng = true
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
  onShow () {
    this.showKeyboard = false
  },
  onHide () {
    this.showKeyboard = true
  }
};
</script>

<style lang="scss">
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
.title{
  height: 100rpx;
  line-height: 100rpx;
  background: #fff;
  flex-direction: column;
  padding: 0 10rpx;
  border-left: 20rpx solid #808ce3;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
}

.active {
  background: #ccc
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
  height: 50rpx;
  line-height: 50rpx;
  padding-right: 20rpx;
  font-size: 30rpx;
}
.value{
  flex-grow: 1;
}
.value input{
  flex: 1;
  border-bottom: 1px solid #ccc;
  height: 50rpx;
}

.header{
  height: 210rpx;
  background: #fff;
  overflow: hidden;
  flex-direction: column;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background: #fff;
  padding: 20rpx 10rpx;
}

.footer{
  height: 150rpx;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;

  .button{
    // background: #fff;
    border: 0;
    border-radius: 0;
    flex: 1;
    text-align: center;
    height: 150rpx;
    font-size: 30rpx;
    font-weight: normal;
    padding: 24rpx;
    box-sizing: border-box;

    .icon{
      width: 40rpx;
      height: 40rpx;
      vertical-align: middle;    
    }
  }
  .button::after{
    border: 0;
  }
}

.table-icon{
  width: 40rpx;
  height: 40rpx;
  margin: 0 20rpx;
}
</style>

