<template>
  <view style="flex-direction: column;flex: 1;box-sizing: border-box;">
    <view class="header" v-show="!loginInfo.userName">
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
          v-if="!tempLock"
          type="scan"
          class="scan"
          size="30"
          @click="handleScan"
        />
      </view>
    </view>

    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table>
          <t-tr>
            <t-th :width="100">时间</t-th>
            <t-th :width="100">机种</t-th>
            <t-th :width="100">产量</t-th>
            <t-th :width="50">线体</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="100">{{ item.time }}</t-td>
              <t-td :width="100">{{ item.program }}</t-td>
              <t-td :width="100">
                <easyinput
                  type="number"
                  style="border: 0"
                  v-model="row['time' + (index + 1)]"
                />
              </t-td>
              <t-td :width="50">{{ item.lineName }}</t-td>
            </t-tr>
          </template>
          <tr v-else style="height:168px">
            <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
          </tr>
        </t-table>
      </scroll-view>
    </view>   
  </view>
</template>

<script>
import Voice from '@/utils/voice.js';
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import easyinput from "@/components/uni-easyinput/uni-easyinput.vue";
import { 
  listByProgramAndTime, 
  addAndUpdateProductionInfo,
  checkGrant,
} from '@/api/api.js'
export default {
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
    easyinput
  },
  props: {
    option: Object
  },
  data() {
    return {
      loginInfo: {},
      number: '',
      tempLock: false,
      curInput: 9,
      autoFocus: false,
      row: {}
    };
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyed')
  },
  computed: {
    times () {
      return [        
        '00:00 ~ 02:00',
        '02:00 ~ 04:00',
        '04:00 ~ 06:00',
        '06:00 ~ 08:00',      
        '08:00 ~ 10:00',
        '10:00 ~ 12:00',
        '12:00 ~ 14:00',
        '14:00 ~ 16:00',
        '16:00 ~ 18:00',
        '18:00 ~ 20:00',
        '20:00 ~ 22:00',
        '22:00 ~ 24:00',
      ]
    },
    mainList () {
      return this.times.map(d => {
        return {
          time: d,
          lineName: this.option.productLine,
          program: this.option.name,
          programId: this.option.programId
        }
      })
    },
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
    },
  },
  watch: {
    
  },
  methods: {
    init () {
      this.query()
      this.curInput = 9
      this.focus()      
    },

    login () {
      if (this.loginInfo.userName) {
        uni.showModal({
          showCancel: true,
          title: "提示",
          content: '确认退出嘛?',
          success: (res) => {
            if (res.confirm) {
              this.loginInfo = {}
              // this.$store.commit('updateExtState', {
              //   jlUser: this.loginInfo
              // })
              this.$emit('login', '')
              this.init()
            }
          },
        })
      } else {
        this.curInput = 9
        this.tempLock = false
        this.focus()
      }
    },

    handleReset () {
      if (this.tempLock) return
      if (!this.loginInfo.loginName) {
        this.focus()
        return
      }
      this.reset()
    },
    changeFocus () {
      //#ifdef APP-PLUS
      // if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    // 登录验证
    checkGrant (data) {
      uni.showLoading()
      checkGrant({
        grantCode: data
      }).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
          this.loginInfo = {
            userName: res.data.userName,
            loginName: res.data.loginName
          }
          // this.$store.commit('updateExtState', {
          //   jlUser: this.loginInfo
          // })
          this.$emit('login', res.data.userName)
        }
      })
    },

    query () {
      uni.showLoading()
      listByProgramAndTime({
        programId: this.option.programId,
        createTime: this.option.date
      }).then(res => {
        this.row = res.rows[0] || {}
      }).finally(() => {
        uni.hideLoading()
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
        this.checkGrant(value)
        return
      }
    },

    submit () {
      if (!this.mainList.length) {
        uni.showToast({
          title: '没有可提交的数据',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      if (!this.loginInfo.loginName) {
        uni.showToast({
          title: '请先登录',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      this.row.programId = this.option.programId
      this.row.createBy = this.loginInfo.loginName
      this.row.createTime = this.option.date
      // 后台保存
      uni.showLoading()
      addAndUpdateProductionInfo(this.row).then(res => {
        uni.showModal({
          showCancel: false,
          title: "提示",
          content: res.msg,
          success: (res) => {
            if (res.confirm) {
              this.query()
              // 提交后自动登出
              this.loginInfo = {}
              // this.$store.commit('updateExtState', {
              //   jlUser: this.loginInfo
              // })
              this.$emit('login', '')
            }
          },
        })
      }).catch(res => {
        uni.showModal({
          showCancel: false,
          title: "提示",
          content: res.data.msg,
          success: (res) => {
            if (res.confirm) {
              // 暂无业务逻辑
            }
          },
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
    
    reset () {
      this.form.lz = ''
      this.form.jptm = ''
      this.form.xptm = ''
      this.curInput = 1
      this.scanedData.lz = ''
      this.scanedData.jptm = ''
      this.scanedData.xptm = ''
      this.focus()
    },

    focus () {
      this.autoFocus = false
      this.$nextTick(() => {
        this.autoFocus = true
      })
    },

    goToPage(url) {
      uni.navigateTo({
        url,
      })
    },

    showLoginEng () {
      this.curInput = 10
      this.focus()
    }

  },
};
</script>

<style lang="scss">
.scanBox{
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  background: #fff;
  line-height: 80rpx;
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

.header{
  height: 90rpx;
  background: #fff;
  overflow: hidden;
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
  height: 150rpx;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;

  .button{
    background: #fff;
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
}

.table-icon{
  width: 40rpx;
  height: 40rpx;
  margin: 0 20rpx;
}
</style>

