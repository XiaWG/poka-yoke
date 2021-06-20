<template>
  <view style="display: flex;flex-direction: column; flex: 1; width: 100%; height: 100%">
    <view class="body">
      <scroll-view scroll-x scroll-y>
        <t-table>
          <t-tr>
            <t-th :width="300">名称</t-th>
            <t-th :width="40">操作</t-th>
          </t-tr>
          <template v-if='mainList.length'>
            <t-tr 
              v-for="(item, index) in mainList" 
              :key="index"
            >
              <t-td :width="300">
                {{ item.id }}
              </t-td>
              <t-td :width="40">
                <text 
                  style="color: blue"
                  @click="handleRecover"
                >恢复</text>
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
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
import { pdaRecoveryList } from '@/api/api.js'
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
      query: {},
      mainList: [
        
      ]
    }
  },

  mounted () {
    setTimeout(() => {
      this.search({ select: 'top' })
    }, 100)
  },

  methods: {
    handleRecover () {
      uni.showModal({
        showCancel: true,
        title: "提示",
        content: '确认恢复嘛?',
        success: (res) => {
          if (res.confirm) {
            
          }
        },
      })
    },
    search (query) {
      uni.showLoading()
      pdaRecoveryList(query).then(res => {
        uni.hideLoading()
        this.mainList = res.rows
      })
    },
  },
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
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
</style>

