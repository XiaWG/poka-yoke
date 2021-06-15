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
          v-if="!tempLock"
          type="scan"
          class="scan"
          size="30"
          @click="handleScan"
        />
      </view>
      <view class="title" style="font-weight: normal;width: 100%; overflow: auto; padding-right: 50px">
        <view style="white-space: nowrap">
          <text v-if="scanedData.lz">料站: {{ scanedData.lz || '--' }}</text>
          <text v-if="scanedData.jptm">旧盘: {{ scanedData.jptm || '--' }}</text>
          <text v-if="scanedData.xptm">新盘: {{ scanedData.xptm || '--' }}</text>
        </view>
        <view class="btn" @click="handleReset">
          重置
        </view>
      </view>
    </view>

    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table>
          <t-tr>
            <t-th :width="50">料站</t-th>
            <t-th :width="130">旧盘条码</t-th>
            <t-th :width="130">新盘条码</t-th>
            <t-th :width="50">比对</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="50">{{ item.lz }}</t-td>
              <t-td :width="130">{{ item.jptm }}</t-td>
              <t-td :width="130">{{ item.xptm }}</t-td>
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
  </view>
</template>

<script>
import Voice from '@/utils/voice.js';
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import { 
  checkGrant,
  materialInspectScan, 
  materialInspectIPQCScan, 
  checkGrantIsEngineer, 
  checkGrantIsIPQC, 
  materialScanCheckStation,
  updatePdaScanConfirm,
  selectPdaScanConfirmInfo
} from '@/api/api.js'
export default {
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
    uniPopupDialog
  },
  props: {
    option: Object
  },
  data() {
    return {
      loginInfo: {},
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
      autoFocus: false,
      IPQCLock: false,
      IPQCUser: null,
      scanedData: {
        lz: '',
        jptm: '',
        xptm: ''
      },
      timer: null
    };
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.clearTimeout()
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyed')
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
    clearTimeout () {
      clearTimeout(this.timer)
    },
    warning () {
      uni.showModal({
        showCancel: false,
        title: "提示",
        content: '接料时间超过规定时间,请尽快提交!',
        success: (res) => {
          if (res.confirm) {
            this.timer = setTimeout(() => {
              this.checkWaring()
            }, 60000)
          }
        },
      })
      setTimeout(() => {
        this.$warning()
      }, 100)
    },
    checkWaring () {
      if (this.mainList.length > 0) {
        const minTime = new Date(this.mainList[0].createTime).getTime()
        const agoTime = new Date().getTime() - minTime
        const remineTime = this.$store.state.beepInterval - agoTime
        if (remineTime > 0) {
          this.timer = setTimeout(() => {
            this.warning()
          }, remineTime)
        } else {
          this.warning()
        }
      }
    },
    init () {
      // 查询未提交数据
      this.query()
      const jlUser = this.$store.state.ext.jlUser
      if (jlUser.loginName) {
        this.loginInfo = jlUser
        this.$emit('login', jlUser.userName)
        setTimeout(() => {
          this.focus()
        }, 100)
      }
      if (!this.loginInfo.userName) {
        this.tempLock = true
        setTimeout(() => {
          this.login()
        }, 100)
      } else {
        this.tempLock = false
      }
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
              this.$store.commit('updateExtState', {
                jlUser: this.loginInfo
              })
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
          this.curInput = 1
          this.$store.commit('updateExtState', {
            jlUser: this.loginInfo
          })
          this.$emit('login', res.data.userName)
        }
      })
    },

    query () {
      uni.showLoading()
      selectPdaScanConfirmInfo({
        programId: this.option.programId,
        lineName: this.option.productLine,
        type: '0'
      }).then(res => {
        this.mainList = res.rows.map(d => {
          d.lz = d.stationName
          d.jptm = d.oldBarcode
          d.xptm = d.newBarcode
          d.bd = 'yes'
          return d
        }) 
        this.checkWaring()       
      }).finally(() => {
        uni.hideLoading()
        this.focus()
      })
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

    // 工程师确认
    checkGrantIsEngineer (data) {
      uni.showLoading()
      checkGrantIsEngineer({
        grantCode: data
      }).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
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
        this.checkGrant(value)
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
        // 检验料站
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
        let errorMsg = ''
        const res = await materialInspectScan({
          programId: this.option.programId,
          lineName: this.option.productLine,
          stationName: this.form.lz,
          oldBarcode: this.form.jptm,
          newBarcode: this.form.xptm,
          createBy: this.loginInfo.loginName
        }).catch(res => {
          errorMsg = res.data.msg || ''
        }).finally(() => {
          uni.hideLoading()
          this.tempLock = false
        })
        if (res && res.code === 0) {
          this.form.bd = 'yes'
          this.form.id = res.data.id
          this.form.jptm = res.data.oldBarcode
          this.form.xptm = res.data.newBarcode
          this.form.createTime = res.data.createTime
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
          this.mainList.push({...this.form})          
          this.reset()
          this.$emit('getTip')
          // 录入第一条之后记录时间 规定时间内提交
          if (this.mainList.length === 1) { this.checkWaring() }
        } else {
          this.errNum ++
          const content = this.errNum >= 3 ? `${errorMsg}(录入错误超过限制次数,请工程师解锁确认)` : errorMsg
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
                } else {
                  this.reset()
                }
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

    submit () {
      this.errNum = 0
      clearTimeout(this.timer)
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

      // 后台保存
      uni.showLoading()
      updatePdaScanConfirm({
        updateBy: this.loginInfo.loginName,
        type: '1',
        detail: this.mainList.map(d => {
          const _obj = {
            id: d.id
          }
          return _obj
        })
      }).then(res => {
        uni.showModal({
          showCancel: false,
          title: "提示",
          content: res.msg,
          success: (res) => {
            if (res.confirm) {
              this.query()
              this.$emit('getTip')
              // 提交后自动登出
              this.loginInfo = {}
              this.$store.commit('updateExtState', {
                jlUser: this.loginInfo
              })
              this.$emit('login', '')
              this.curInput = 9
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
      
      this.scanedData.lz = ''
      this.scanedData.jptm = ''
      this.scanedData.xptm = ''
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
.value{
  flex-grow: 1;
}
.value input{
  flex: 1;
  border-bottom: 1px solid #ccc;
  height: 50rpx;
}

.header{
  height: 160rpx;
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

