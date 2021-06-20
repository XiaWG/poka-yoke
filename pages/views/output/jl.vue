<template>
  <view style="display: flex;flex-direction: column; flex: 1; width: 100%; height: 100%">
    <view class="header">
      <view class="scanBox" @click="handleClick">
        <input
          class="scanInput"
          :disabled="true"
          placeholder="请输入查询条件"
        />
        <uni-icons
          type="search"
          class="scan"
          size="30"
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
              <t-td :width="100">
                {{ item.time }}
              </t-td>
              <t-td :width="100">
                {{ item.program }}
              </t-td>
              <t-td :width="100">
                {{ row['time' + (index + 1)] }}
              </t-td>
              <t-td :width="50">
                {{ item.lineName }}
              </t-td>
            </t-tr>
          </template>
          <tr v-else style="height:168px">
            <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
          </tr>
        </t-table>
      </scroll-view>
    </view>

    <uni-popup class="list-dialog" ref="popup" type="fullScreen">
      <view @click="$refs.calendar.open()">
        <input 
          class="queryInput"
          type="text"
          placeholder="请选择时间"
          v-model.trim="query.createTime"
        />
      </view>
      <view style="padding: 20rpx;display:flex;flex-direction: row">
        <span class="searchBtn" style="background: #24bb24" @click="search(query)">确认</span>
        <span class="searchBtn" style="background: #007aff" @click="reset">重置</span>
        <span class="searchBtn" style="background: red" @click="$refs.popup.close()">取消</span>
      </view>
      <uni-calendar 
        ref="calendar"
        :insert="false"
        :lunar="true"
        @confirm="handleChange"
      />
    </uni-popup>
  
  </view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
import { listByProgramAndTime } from '@/api/api.js'
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
  props: {
    option: Object
  },
  data() {
    return {
      query: {
        programId: this.option.programId,
        createTime: this.$formatterTime(new Date(), false, 1)
      },
      row: {}
    }
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
  },

  mounted () {
    this.query.programName = this.option.name
    this.query.lineName = this.option.productLine
    setTimeout(() => {
      this.search(this.query)
    }, 100)
  },

  methods: {
    handleClick () {
      this.$refs.popup.open()
    },

    search (query) {
      this.$refs.popup.close()
      uni.showLoading()
      listByProgramAndTime(query).then(res => {
        uni.hideLoading()
        this.row = res.rows[0] || {}
      })
    },

    reset () {
      this.query.createTime = this.$formatterTime(new Date(), false, 1)
    },

    handleChange (e) {
      this.query.createTime = e.fulldate
    }
  }
  
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
  margin: 5rpx 10rpx;
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
  height: 85rpx;
  background: #fff;
  overflow: hidden;
}

.body{
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background: #fff;
  padding: 0 10rpx;
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

