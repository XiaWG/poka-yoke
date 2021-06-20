<template>
  <view style="flex-direction: column;flex: 1;box-sizing: border-box;">
    <view class="header">
      <view style="line-height: 50px; justify-content: center;">
        {{ $formatterTime(date, false, 2) }}
      </view>
    </view> 
    <view class="body">
      <view class="charts-box" style="width: 100%;height: 300px">
        <qiun-data-charts 
          type="column" 
          :localdata="localdata"
          :opts="{enableScroll:true, xAxis:{scrollShow:true, itemCount:15, disableGrid:true}}"
          :ontouch="true" 
          :canvas2d="true"
        />
      </view>
    </view>   
  </view>
</template>

<script>
import Voice from '@/utils/voice.js';
import { 
  currentMonthList,
} from '@/api/api.js'
export default {
  components: {},
  props: {
    option: Object
  },
  data() {
    return {
      date: new Date(),
      reshow: false,
      chartData:{
        categories: [],
        series: [{
          name: "产量",
          data: []
        }]
      },
      localdata: []
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

  },
  watch: {
    
  },
  methods: {
    init () {
      // 查询未提交数据
      this.query()
    },
    
    query () {
      uni.showLoading()
      currentMonthList().then(res => {
        this.chartData.categories = res.rows.map(d => d.dateInfo)
        this.chartData.series[0].data = res.rows.map(d => d.productionInfo)
        this.localdata = res.rows.map(d => {
          return {
            value: d.productionInfo,
            text: d.dateInfo,
            group: '产量'
          }
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
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
  height: 100rpx;
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

