<template>
  <view style="flex-direction: column; flex: 1; width: 100%; height: 100%; box-sizing: border-box;">
    <view class="header">
      <view class="title">
        {{ option.user[0].userName }} - {{ option.user[1].userName }} - {{ curLine }}产线
      </view>
      <view class="scanBox">
        <input
          class="scanInput"
          :value="scanNumber"
          :focus="autoFocus"
          @confirm="(e) => handleGetScanData(e.detail.value, curField)"
          :placeholder="placeholder"
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
          料站: {{ scanedData.lz || '--' }}
          条码: {{ scanedData.yptm || '--' }}
        </view>        
        <view class="btn" @click="handleReset">
          重置
        </view>
      </view>
    </view>
    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table min-width="730px">
          <t-tr>
            <t-th :width="100">料站</t-th>
            <t-th :width="150">原盘条码</t-th>
            <t-th :width="80">规格</t-th>
            <t-th :width="80">封装</t-th>
            <t-th :width="80">精度</t-th>
            <t-th :width="80">耐压</t-th>
            <t-th :width="80">操作</t-th>
          </t-tr>          
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index" 
              @click.native="handleRefreshSub(item, index)"
              :class="[(cur && index === cur.index) ? 'active' : '']"
            >
              <t-td :width="100">
                {{ item.lz}}<span style="color:red">{{ item.isT ? '[替]' : '' }}</span>
              </t-td>
              <t-td :width="150">{{ item.yptm }}</t-td>
              <t-td :width="80">{{ item.gg }}</t-td>
              <t-td :width="80">{{ item.fz }}</t-td>
              <t-td :width="80">{{ item.jd }}</t-td>
              <t-td :width="80">{{ item.ny }}</t-td>
              <t-td :width="80">
                <template v-if="item.actionAble">
                  <span>
                    <image
                      class="table-icon" 
                      src='../../../static/icon/edit.png' 
                      @click.stop="handleEdit(item, index)"
                    />
                  </span>
                  <span>
                    <image
                      class="table-icon" 
                      src='../../../static/icon/delete.png'
                      @click.stop="handleDel(index)"
                    />
                  </span>
                </template>
                <template v-else>
                  --
                </template>
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
      <button
        class="button"
        @click="handleReplace((curInput !== 3)), handleReplace2()"
        style="border-right: 1px solid #ccc"
      >
        <image
          class="icon" 
          src='../../../static/icon/replace.png'
        />
        {{ curInput === 3 ? '录入主料' : '录入替代料'}}
      </button>
      <!-- <span
        class="button"
        style="border-left: 1px solid #ccc;border-right: 1px solid #ccc"
        @click="handleCombine"
      >
        <image
          class="icon" 
          src='../../../static/icon/combine.png'
        />
        聚合/不聚合
      </span> -->
      <button
        class="button"
        @click="handleSubmitAll"
      >
        <image
          class="icon" 
          src='../../../static/icon/submit.png'
        />
        提交
      </button>
    </view>

    <uni-popup ref="popup" type="center" :maskClick="false">
      <view class="row pop_title">
        编辑料站信息
      </view>
      <view class="row">
        <view class="label">
          料站
        </view>
        <view class="value">
          <easyinput
            v-model="form.lz"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <view class="label">
          原盘条码
        </view>
        <view class="value">
          <easyinput
            v-model="form.yptm"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <view class="label">
          规格
        </view>
        <view class="value">
          <easyinput
            v-model="form.gg"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <view class="label">
          封装
        </view>
        <view class="value">
          <easyinput
            v-model="form.fz"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <view class="label">
          精度
        </view>
        <view class="value">
          <easyinput
            v-model="form.jd"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <view class="label">
          耐压
        </view>
        <view class="value">
          <easyinput
            v-model="form.ny"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="row">
        <button type="warn" size="default" style="width:100%" @click="$refs.popup.close()">
          取消
        </button>
        <button type="primary" size="default" style="width:100%" @click="handleSubmit">
          确认
        </button>
      </view>
		</uni-popup>

    <uni-popup ref="result_pop" type="center" :maskClick="false">
      <view class="row pop_title">
        料站信息采集完成
      </view>
      <view class="row">
        料号: {{ option.name }}
      </view>
      <view class="row">
        采集人: {{ option.user[0].userName }}, {{ option.user[1].userName }}
      </view>
      <view class="row">
        采集时间: {{ new Date() | formatterTime }}
      </view>
      <view class="row">
        采集结果: {{ operation.result }}
      </view>
      <view class="row">
        <button type="primary" size="mini" style="width:100%" @click="goToPage('/pages/menu/menu')">
          确认
        </button>
      </view>     
		</uni-popup>
  </view>
</template>

<script>
import easyinput from "@/components/uni-easyinput/uni-easyinput.vue";
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import { partDataDetailByPartNo, programCollection, pdaProgramDetailList, deleteProgramDetailById } from '@/api/api.js'

export default {
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
    easyinput
  },
  data() {
    return {
      autoFocus: true,
      option: {},
      mainList: [],
      subList: [],
      form: {
        line: '',
        lz: '',
        yptm: '',
        gg: '',
        fz: '',
        jd: '',
        ny: '',
      },
      cur: {
        item: null,
        index: -1
      },
      curLine: '',
      curInput: 1, // 1-料站 2-条码 3-替代
      curIndex: null,
      scanNumber: '',
      operation: {
        result: ''
      },
      scanedData: {
        lz: '',
        yptm: ''
      },
      showKeyboard: false
    };
  },
  onShow() {
    // for (var i =0 ;i< 100; i++) {
    //   this.mainList.push({})
    // }
  },
  onLoad(option) {
    this.option = option
    this.option.user = JSON.parse(option.user)
    if (this.option.programId) { // 从料站表记录编辑进入 需带出原有数据
      this.curLine = this.option.curLine
      this.getList()
    }
  },
  onReady() {
    const title = `信息采集-料站表-${this.option.name}`
    uni.setNavigationBarTitle({
      title,
    })
  },
  computed: {
    placeholder () {
      return this.curInput === 1 ? '请登记或扫描料站' : this.curInput === 2 ? '请登记或扫描原盘条码' : '请登记或扫描替代料条码'
    },
    curField () {
      return this.curInput === 1 ? 'lz' : this.curInput === 2 ? 'yptm' : 'yptm'
    },
  },
  methods: {
    getList () {
      uni.showLoading()
      pdaProgramDetailList({
        programId: this.option.programId
      }).then(res => {
        uni.hideLoading()
        this.mainList = res.rows.map(d => {
          d.line = this.option.curLine
          d.lz= d.stationName
          d.yptm = d.originalBarcode
          d.isT = d.type == 1
          d.actionAble = false
          return d
        }) || []
      })
    },
    changeFocus () {
      //#ifdef APP-PLUS
      if (!this.showKeyboard) uni.hideKeyboard()
      //#endif
    },
    async handleGetScanData (value, field) {
      this.scanNumber = value
      value = value.trim()
      this.$nextTick(() => {
        this.scanNumber = ''
      })
      if (!value) {
        uni.showToast({
          title: '扫描数据为空',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      if (this.curInput === 1) { // 料站
        if (value.length < 2) {
          uni.showToast({
            title: '扫描的条码不正确',
            duration: 2000,
            icon: "none",
          })
          this.$warning()
          return false
        }
        if (this.curLine && value.slice(0, 1) != this.curLine) {
          uni.showToast({
            title: '请扫描同产线的料站',
            duration: 2000,
            icon: "none",
          })
          this.$warning()
          return false
        }
        this.curLine = value.slice(0, 1)
        this.form.line = this.curLine
        this.form[this.curField] = value.slice(1)
        this.scanedData.lz = this.form[this.curField]
        this.scanedData.yptm = ''
        this.curInput ++
      } else if (this.curInput === 2 || this.curInput === 3) { // 圆盘
        uni.showLoading()
        const res = await partDataDetailByPartNo({
          partCode: value
        })
        uni.hideLoading()
        let _obj = {}
        if (res && res.code === 0 && res.data) {
          this.form[this.curField] = value
          _obj = {
            ...this.form,
            isT: this.curInput === 3, // 替代料
            gg: res.data.spec,
            fz: res.data.potting,
            jd: res.data.accuracy,
            ny: res.data.compression,
            actionAble: true
          }
        } else {
          return false
        }
        this.scanedData.yptm = this.form[this.curField]
        if (this.curInput === 3) {
          this.mainList.splice((this.cur.index + 1), 0, _obj)
        } else {
          this.mainList.unshift(_obj)
          this.cur = {
            item: _obj,
            index: 0
          }
        }
        if (this.curInput === 3) {
          this.handleReplace(true)
        } else {
          this.reset()
        }
      }
    },

    handleScan () {
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
        success: (res) => {
          this.handleGetScanData(res.result);
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

    handleReplace (rep) {      
      this.reset()
      if (this.curInput !== 3 && (!this.cur.item || this.cur.item.isT)) {
        uni.showToast({
          title: '请选择主料',
          duration: 2000,
          icon: "none",
        })
        return
      }
      if (rep) {
        this.scanedData.lz = this.cur.item.lz
        this.curInput = 3
      }
      if (this.curInput !== 3) { // 录入主料
        this.cur = {}
      } else {
        this.form.lz = this.cur.item.lz
      }
    },
    handleReplace2 () {
      this.scanedData.yptm = ''
      this.autoFocus = false
      this.focus()
    },

    handleDel (index) {
      this.mainList.splice(index, 1)
      if (this.mainList.length === 0) {
        this.curLine = ''
      }
    },

    handleEdit (item, index) {
      this.form = {...item}
      this.curIndex = index
      this.$refs.popup.open()
    },

    handleSubmit () {
      if (!this.form.lz || !this.form.yptm) {
        uni.showToast({
          title: '料站,条码不能为空',
          duration: 2000,
          icon: "none",
        })
        return
      }
      this.mainList.splice(this.curIndex, 1, {...this.form})
      this.curIndex = null
      this.$refs.popup.close()
    },

    handleRefreshSub (item, index) {
      this.cur = {
        item: item,
        index: index
      }
      this.curLine = item.line
      this.subList = item.subList
      this.reset()
    },

    handleCombine () { // 聚合

    },

    handleSubmitAll () {
      const data = this.mainList.filter(d => !d.id)
      if (data.length === 0) {
        uni.showToast({
          title: '没有可以提交的数据',
          duration: 2000,
          icon: "none",
        })
        return
      }
      const postData = {
        programName: this.option.name,
        collector1: this.option.user[0].loginName,
        collector2: this.option.user[1].loginName,
        lineName: this.curLine,
        detail: data.map(d => {
          const __obj = {}
          __obj.stationName = d.lz,
          __obj.partCode = d.yptm,
          __obj.type = d.isT ? 1 : 0
          return __obj
        })
      }
      uni.showLoading()
      programCollection(postData).then(res => {
        uni.hideLoading()
        if (res.code === 0) {
          this.operation.result = res.msg
          this.$refs.result_pop.open()
        }
      })      
    },

    reset () {
      this.form.line = ''
      this.form.lz = ''
      this.form.yptm = ''
      this.form.gg = ''
      this.form.fz = ''
      this.form.jd = ''
      this.form.ny = ''
      this.$nextTick(() => {
        this.scanNumber = ''
      })
      this.curInput = 1
    },

    handleReset () {
      this.scanedData.lz = ''
      this.scanedData.yptm = ''
      this.reset()
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
  border-bottom: 1px solid #ccc;
  height: 50rpx;
  padding: 10rpx;
  font-size: 30rpx;
}
.header{
  height: 242rpx;
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
</style>

