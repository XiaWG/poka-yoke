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
          <text v-if="scanedData.lz">料站: {{ scanedData.lz || '--' }}</text>
          <text v-if="scanedData.lp">料盘: {{ scanedData.lp || '--' }}</text>
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
            <t-th :width="40">料站</t-th>
            <t-th :width="150">料盘</t-th>
            <t-th :width="40">比对</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="40">{{ item.lz }}</t-td>
              <t-td :width="150">{{ item.lp }}</t-td>
              <t-td :width="40">
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
import { materialInspectIPQCPatrol,  materialScanCheckStation } from '@/api/api.js'
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
        lp: '',
        bd: true
      },
      cur: null,
      IPQC: false, // 是否IPQC激活
      curInput: 1,
      errNum: 0,
      IPQCInd: -1,
      showEng: false,
      dataNum: 0,
      autoFocus: true,
      IPQCLock: false,
      IPQCUser: null,
      scanedData: {
        lz: '',
        lp: ''
      },
    };
  },
  onShow() {
    this.focus()
  },
  onLoad(option) {
    this.option = option
    this.option.user = JSON.parse(option.user)
  },
  onReady() {
    const title = `IPQC巡检-${this.option.productLine}-${this.option.name}-${this.option.user[0].userName}`
    uni.setNavigationBarTitle({
      title,
    })
  },
  computed: {
    placeholder () {
      return this.curInput === 1 ? '请扫描站位条码' : '请扫描料盘条码'
    },
    curField () {
      return this.curInput === 1 ? 'lz' : 'lp'
    }
  },
  methods: {
    handleReset () {
      this.scanedData.lz = ''
      this.scanedData.lp = ''
      this.reset()
    },
    changeFocus () {
      //#ifdef APP-PLUS
      // if (!this.showKeyboard) uni.hideKeyboard()
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
          if (this.IPQCLock) {
            this.IPQCLogin(res.result)
            return
          }
          if (this.showEng) {
            this.checkGrantIsEngineer(res.result)
            return
          }
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
      this.form[this.curField] = value
      this.scanedData.lz = ''
      this.scanedData.lp = ''
      this.scanedData[this.curField] = value
      if (this.curInput === 1) {
        const res = await materialScanCheckStation({
          programId: this.option.programId,
          stationName: this.form.lz,
        })
        if (!res) {
          this.reset()
          return false
        }
      }
      if (this.curInput >= 2) { // 输入完毕
        this.tempLock = true
        this.autoFocus = false
        // 调用后台接口
        uni.showLoading()
        const res = await materialInspectIPQCPatrol({
          programId: this.option.programId,
          lineName: this.option.productLine,
          stationName: this.form.lz,
          newBarcode: value,
          createBy: this.option.user[0].loginName
        })
        uni.hideLoading()
        this.tempLock = false
        if (res && res.code === 0) {
          this.$Voice('../../../static/music/OK.mp3')
          this.form.bd = 'yes'
        } else {
          this.form.bd = 'error'
        }
        this.mainList.push({...this.form})
        this.reset()
      } else {
        this.curInput ++
      }
    },
    
    reset () {
      this.form.lz = ''
      this.form.lp = ''
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
  },
  
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
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

