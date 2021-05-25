<template>
  <view style="display: flex;flex-direction: column; flex: 1; width: 100%; height: 100%">
    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table min-width="450px">
          <t-tr>
            <t-th :width="50">料站</t-th>
            <t-th :width="100">料号</t-th>
            <t-th :width="50">类型</t-th>
            <t-th :width="65">采集人1</t-th>
            <t-th :width="65">采集人2</t-th>
            <t-th :width="50">操作</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="50">
                {{ item.stationName }}
              </t-td>
              <t-td :width="100">
                {{ item.originalBarcode }}
              </t-td>
              <t-td :width="50">
                {{ item.type === '0' ? '主料' : '替代料' }}
              </t-td>
              <t-td :width="65">
                {{ item.firCollector }}
              </t-td>
              <t-td :width="65">
                {{ item.secCollector }}
              </t-td>
              <t-td :width="50">
                <image
                  class="table-icon" 
                  src='../../../static/icon/delete.png'
                  @click.stop="handleDel(item)"
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
    <uni-popup class="list-dialog" ref="login_popup" type="center" :maskClick="false">
      <view class="row pop_title">
        请登陆账号
      </view>
      <view class="row">
        <input 
          class="login-input"
          placeholder="账号"
          v-model.trim="login.user"
          autocomplete="off"
        />
      </view>
      <view class="row">
        <input 
          class="login-input"
          type="password"
          v-model.trim="login.password"
          placeholder="密码"
          autocomplete= "new-password"
        />
      </view>
      <view class="row">
        <button type="warn" size="default" style="width:100%" @click="handleCancelLogin">
          取消
        </button>
        <button type="primary" size="default" style="width:100%" @click="handleLogin">
          确认
        </button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
import { pdaProgramDetailList, deleteProgramDetailById } from '@/api/api.js'
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";

export default {
  components: {
    uniCalendar,
    tTable,
    tTh,
    tTr,
    tTd,
  },
  data() {
    return {
      option: {},
      mainList: [],
      programDetailId: '',
      login: {
        user: '',
        password: ''
      }

    }
  },
  onReady() {
    const title = `料站表-${this.option.name}`
    uni.setNavigationBarTitle({
      title,
    })
  },
  onLoad (option) {
    this.option = option
  },

  mounted () {
    this.getList()
  },

  methods: {
    getList () {
      uni.showLoading()
      pdaProgramDetailList({
        programId: this.option.id
      }).then(res => {
        uni.hideLoading()
        this.mainList = res.rows || []
      })
    },
    handleDel (r) {
      this.programDetailId = r.id
      this.$refs.login_popup.open()
    },

    handleLogin () {
      if (!this.login.user || !this.login.password) {
        uni.showToast({
          title: '请输入账号密码',
          duration: 2000,
          icon: "none",
          position: 'top'
        })
        return
      }
      deleteProgramDetailById({
        programDetailId: this.programDetailId,
        userName: this.login.user,
        password: this.login.password,
      }).then(res => {
        if (res.code === 0) {
          uni.showToast({
            title: '删除成功',
            duration: 2000,
            icon: "none",
            position: 'top'
          })
          this.getList()
        }
        this.handleCancelLogin()
      })
    },

    handleCancelLogin () {
      this.login.user = ''
      this.login.password = ''
      this.$refs.login_popup.close()
    }
  },

  onNavigationBarButtonTap(e) {
    if (e.index === 0) {
      uni.navigateTo({
        url: `/pages/views/info/materailStationForm?programId=${this.option.id}&programName=${this.option.name}&curLine=${this.option.curLine}`,
      })
    } else if (e.index === 1) {
      this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
    }
	},
  
}
</script>

<style lang="scss">
.scanBox{
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  background: #fff;
  height: 80rpx;
  line-height: 80rpx;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 10rpx;
  padding: 0 10rpx;
  width: 100%;
}
.scanInput{
  height: 80rpx;
  flex: 1;
  padding: 0 10rpx;
}
.title{
  background: #fff;
  flex-direction: column;
  padding: 30rpx 10rpx;
  border-left: 20rpx solid #808ce3;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
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
  height: 100rpx;
  background: #fff;
  overflow: hidden;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background: #fff;
  padding: 20rpx 10rpx;
}

.footer{
  flex-grow: 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;

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
  margin: 0 10rpx;
}

.searchBtn{
  width: 100%;
  border-radius: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 5px;
  color: #fff;
}
.queryInput{
  border: 1px solid #ccc;
  width: 100%;
  margin: 10px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
}

.login-input{
  border: 1px solid #ccc;
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
}
</style>

