<template>
  <movable-area style="display: flex; flex-direction: column; flex: 1; width: 100%;height: 100%">
    <view class="header" style="overflow: auto">
      <view class="tab">
        <view
          v-for="(item, index) in tabs"
          :key="index"
          :class="['tab-item', index === active ? 'active' : '']"
          @click="handleTab(item, index)"
        >
          <view v-if="item.tip && item.num > 0" class="tip">
            {{ item.num > 99 ? '99+' : item.num }}
          </view>
          {{ item.title }}
        </view>
      </view>
    </view>
    <view class="body">
      <components 
        ref="com"
        :is="curComponent"
        :option="option"
        @login="setLogin"
        @submit="handleSetSubList"
        @getTip="handleGetTip"
      />
    </view>
    <view class="footer" v-if="!isReport">
      <span
        class="button"
        style="border-right: 1px solid #ccc"
        @click="handleLogin"
      >
        <image
          class="icon" 
          src='../../../static/icon/loginOut.png'
        />
        登入/登出
      </span>
      <span
        class="button"
        style="border-right: 1px solid #ccc"
        @click="handleSubmit"
      >
        <image
          class="icon" 
          src='../../../static/icon/submit.png'
        />
        提交
      </span>
      <span
        class="button"
      >
        <image
          class="icon" 
          src='../../../static/icon/submit.png'
        />
        状态栏
      </span>
    </view>
    <movable-view 
      v-if="!noLogin"
      :x="x" :y="y" direction="all" @change="onChange"
      class="movable-view"
      :style="{width: userWidth}"
      @click="handleToggleUser"
    >
      <view style="background: #fff;border-radius: 50%">
        <span 
          :class="['iconfont', logined ? 'logined' : 'un-logined']"
        >&#xe65a;</span>
      </view>
      <view class="login-user">
        {{ loginInfo.userName || '未登录' }}
      </view>
    </movable-view>
  </movable-area>
</template>

<script>
import jl from './jl'
import hd from './hd'
import upLoadList from './pdaScanHistoryList'
import Ipxj from './Ipxj'
import {
  selectPdaScanConfirmInfo
} from '@/api/api.js'
export default {
  components: {
    jl,
    hd,
    upLoadList,
    Ipxj
  },
  data () {
    return {
      isReport: false,
      noLogin: false,
      loginInfo: {
        userName: ''
      },
      userWidth: '40px',      
      active: 0,
      curComponent: '',
      option: {},
      x: 375,
      y: 50,
      old: {
        x: 375,
        y: 50,
      },
      showKeyboard: false,
      timer: null,
      jlListLength: 0,
      hdListLength: 0
    }
  },
  computed: {
    tabs () {
      return [
        {
          title: '接料',
          page: 'jl',
          tip: true,
          num: this.jlListLength
        },
        {
          title: '核对',
          page: 'hd',
          tip: true,
          num: this.hdListLength
        },
        {
          title: '记录',
          page: 'upLoadList',
          isReport: true,
          noLogin: true
        },
        {
          title: '巡检',
          page: 'Ipxj'
        }
      ]
    },
    logined () {
      return !!this.loginInfo.userName
    }
  },
  onLoad (option) {
    this.option = option
  },
  onShow () {
    this.setTimer()
    this.getJLData()
    this.getHDData()
  },
  mounted () {
    this.active = 0
    this.curComponent = this.tabs[0].page 
  },
  onReady() {
    const title = `防错-${this.option.productLine}-${this.option.name}`
    uni.setNavigationBarTitle({
      title,
    })
  },
  methods: {
    handleGetTip () {
      this.getJLData()
      this.getHDData()
    },
    setTimer () {
      clearInterval(this.timer)
      this.timer = this.showKeyboard ? null : setInterval(() => {
        //#ifdef APP-PLUS
        uni.hideKeyboard()
        //#endif
      }, 10)
    },
    getJLData () {
      selectPdaScanConfirmInfo({
        programId: this.option.programId,
        lineName: this.option.productLine,
        type: '0'
      }).then(res => {
        if (res && res.code === 0) {
          this.jlListLength = res.rows.length
        }
      })
    },
    getHDData () {
      selectPdaScanConfirmInfo({
        programId: this.option.programId,
        lineName: this.option.productLine,
        type: '1'
      }).then(res => {
        if (res && res.code === 0) {
          this.hdListLength = res.rows.length
        }
      })
    },
    handleToggleUser () {
      this.x = this.old.x
      this.y = this.old.y
      this.userWidth = this.userWidth === '40px' ? '120px' : '40px'
    },
    tap: function(e) {
      this.x = this.old.x
      this.y = this.old.y
      this.$nextTick(function() {
        this.x = 30
        this.y = 30
      })
    },
    onChange: function(e) {
      this.old.x = e.detail.x
      this.old.y = e.detail.y
    },
    handleTab (item, index) {
      this.loginInfo.userName = ''
      this.active = index
      this.curComponent = item.page
      this.isReport = item.isReport
      this.noLogin = item.noLogin
    },
    handleLogin () {
      this.$refs.com.login()
    },
    handleSubmit () {
      this.$refs.com.submit()
    },
    setLogin (data) {
      this.loginInfo.userName = data
    },
    handleSetSubList (data) {
      this.option.subList = data
    }
  },
  onNavigationBarButtonTap(e) {
    if (e.index === 0) {
      clearInterval(this.timer)
      uni.reLaunch({ // 返回主页
        url: '/pages/menu/menu'
      })
    }
    if (e.index === 1) { // 键盘
      this.showKeyboard = !this.showKeyboard
      uni.showToast({
        title: this.showKeyboard ? '键盘开启' : '键盘关闭',
        duration: 5000,
        icon: "none",
      })
      this.setTimer()
    }
    if (e.index === 2) { // 切换
      uni.showModal({
        showCancel: true,
        title: "提示",
        content: '确认切换线体嘛?',
        success: (res) => {
          if (res.confirm) {
            this.$store.commit('updateExtState', {
              programId: '',
              productName: '',
              productLine: ''
            })
            clearInterval(this.timer)
            uni.navigateTo({
              url: '/pages/views/ext/index'
            })
          }
        },
      })
    }
	},
}
</script>

<style lang="scss">

.header{
  height: 90rpx;
  overflow: hidden;
  background: #fff;
  flex-direction: column;
  justify-content: flex-end;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background: #fff;
}

.footer{
  height: 80rpx;
  border-top: 1px solid #ccc;
  box-sizing: border-box;

  .button{
    background: #fff;
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
}

.table-icon{
  width: 40rpx;
  height: 40rpx;
  margin: 0 10rpx;
}

.tab{
  flex-direction: row;
  height: 80rpx;
  line-height: 80rpx;
  border-bottom: 2px solid #ccc;
  position: relative;
  // margin-top: 10rpx;

  .tab-item{
    padding: 0 30rpx;
    border: 2px solid transparent;
    border-top-right-radius: 10rpx;
    border-top-left-radius: 10rpx;
    white-space:nowrap;
    position: relative;

    .tip{
      position: absolute;
      top: -5px;
      right: -10px;
      background: red;
      color: #fff;
      width: 30px;
      height: 20px;
      border-radius: 10px;
      line-height: 20px;
      font-size: 12px;
      justify-content: center;
      // z-index: 1;
    }
  }

  .tab-item.active{
    border: 2px solid #ccc;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    background: #fff;
    color: #1890ff
  }
}

.movable-view{
  min-width: 40px;
  min-height: 40px;
  // border: 1px solid #ccc;
  border-radius: 40px;
  box-shadow: 0px 0px 5px #1890ff;
  white-space:nowrap;
  display: flex;
  flex-direction: row;
  line-height: 40px;
  transition: width .5s;
  background: #fff;
  overflow: hidden;
}

.iconfont{
  width: 40px;
  height: 40px;
  font-size: 30px;
  text-align: center;
  line-height: 40px;
}

.logined{
  color: green;
}

.un-logined{
  color: #ccc;
}

.login-user{
  display: inline-block;
  width: 80px;
  height: 100%;
  text-align: center;
  color: #ccc;
}
</style>
