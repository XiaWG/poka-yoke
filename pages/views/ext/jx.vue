<template>
  <view style="flex-direction: column;flex: 1;box-sizing: border-box;width: 100%">
    <view class="header">
      <view class="scanBox" :style="{background: (showEng || tempLock || IPQCLock) ? '#ccc' : ''}">
        <input
          ref="input"
          :disabled="showEng || tempLock"          
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
          size="30"
          @click="handleScan"
        />
      </view>
      <view class="title" style="font-weight: normal;width: 100%; overflow: auto;padding-right: 50px">
        <view style="white-space: nowrap">
          <text v-if="scanedData.lz">锡膏: {{ scanedData.xg || '--' }}</text>
        </view>
        <view class="btn" @click="handleReset">
          重置
        </view>
      </view>
    </view>

    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table style="width:100%">
          <t-tr>
            <t-th :width="150">锡膏条码</t-th>
            <t-th :width="100">时间</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="150">{{ item.solderNo }}</t-td>
              <t-td :width="100">{{ item.createTime }}</t-td>
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
import { checkGrant, addSolderList,  addSolder } from '@/api/api.js'
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
        xg: '',
      },
      cur: null,
      IPQC: false, // 是否IPQC激活
      curInput: 1,
      errNum: 0,
      IPQCInd: -1,
      showEng: false,
      dataNum: 0,
      autoFocus: false,
      IPQCLock: false,
      IPQCUser: null,
      scanedData: {
        xg: ''
      },
    };
  },
  onShow() {
    this.focus()
  },
  mounted () {
    this.init()
  },
  computed: {
    placeholder () {
      return this.curInput === 1 ? '请扫描锡膏条码' : this.curInput === 9 ? '请输入账号' : '请扫描料盘条码'
    },
    curField () {
      return this.curInput === 1 ? 'xg' : this.curInput === 9 ? 'user' : 'lp'
    }
  },
  methods: {
    init () {
      const jxUser = this.$store.state.ext.jxUser
      if (jxUser.loginName) {
        this.loginInfo = jxUser
        this.$emit('login', jxUser.userName)
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
      // 查询未提交数据
      this.query()
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
                jxUser: this.loginInfo
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
    query () {
      uni.showLoading()
      addSolderList({
        programId: this.option.programId
      }).then(res => {
        this.mainList = res.rows     
      }).finally(() => {
        uni.hideLoading()
        this.focus()
      })
    },
    handleReset () {
      if (this.tempLock) return
      if (!this.loginInfo.loginName) {
        this.focus()
        return
      }
      this.scanedData.xg = ''
      this.reset()
    },

    changeFocus () {
      //#ifdef APP-PLUS
      // if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },

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
          this.$store.commit('updateExtState', {
            jxUser: this.loginInfo
          })
          this.curInput = 1
          this.$emit('login', res.data.userName)
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
      this.form[this.curField] = value
      this.scanedData.xg = ''
      this.scanedData[this.curField] = value
      if (this.curInput >= 1) { // 输入完毕
        this.tempLock = true
        this.autoFocus = false
        // 调用后台接口
        uni.showLoading()
        const res = await addSolder({
          programId: this.option.programId,
          programName: this.option.name,
          lineName: this.option.productLine,
          solderNo: value,
          createBy: this.loginInfo.loginName
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
          this.tempLock = false
        })
        this.mainList = res.data
        this.reset()
      } else {
        this.curInput ++
      }
    },
    
    reset () {
      this.form.xg = ''
      this.curInput = 1
      this.focus()
    },

    focus () {
      this.autoFocus = false
      this.$nextTick(() => {
        this.autoFocus = true
      })
    },

    loginOut () {
      this.goToPage(`/pages/menu/menu`)
    },

    goToPage(url) {
      uni.navigateTo({
        url,
      })
    },

    submit () {

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

