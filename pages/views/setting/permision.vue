<template>
  <view style="flex-direction: column; flex: 1;width: 100%">
    <view class="body">
      <view class="logined" v-if="!logined">
        <image
          style="width: 100%;height: 100%" 
          src='../../../static/icon/user.png'
        />
      </view>
      <view v-if="logined">
        <view style="width: 100%;overflow: auto">
          <t-table min-width="400px">
            <t-tr>
              <t-th :width="80">权限名称</t-th>
              <t-th :width="80">信息采集</t-th>
              <t-th :width="80">生产防错</t-th>
              <t-th :width="80">参数配置</t-th>
              <t-th :width="80">操作</t-th>
            </t-tr>
            <template v-if='mainList.length'>
              <t-tr 
                v-for="(item, index) in mainList" 
                :key="index"
              >
                <t-td :width="80">
                  {{ item.qx }}
                </t-td>
                <t-td :width="80">
                  <image
                    class="table-icon" 
                    :src="'../../../static/icon/' + (item.permision.includes('xxcj')?'yes':'error') + '.png'"
                    @click.stop="handleClickTd(item, index, 'xxcj')"
                  />
                </t-td>
                <t-td :width="80">
                  <image
                    class="table-icon" 
                    :src="'../../../static/icon/' + (item.permision.includes('scfc')?'yes':'error') + '.png'"
                    @click.stop="handleClickTd(item, index, 'scfc')"
                  />
                </t-td>
                <t-td :width="80">
                  <image
                    class="table-icon" 
                    :src="'../../../static/icon/' + (item.permision.includes('cspz')?'yes':'error') + '.png'"
                    @click.stop="handleClickTd(item, index, 'cspz')"
                  />
                </t-td>
                <t-td :width="80">
                  <!-- <span>
                    <image
                      class="table-icon" 
                      src='../../../static/icon/edit.png' 
                      @click.stop="handleEdit(item, index)"
                    />
                  </span> -->
                  <span>
                    <image
                      class="table-icon" 
                      src='../../../static/icon/delete.png'
                      @click.stop="handleDel(index)"
                    />
                  </span>
                </t-td>
              </t-tr>
            </template>
            <tr v-else style="height:168px">
              <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
            </tr>
          </t-table>
        </view>
      </view>
      
    </view>
    
    <view 
      class="footer"
    >
      <template v-if="!logined">
        <span class="button" @click="handleScan('userName')">
          <image
            class="icon" 
            src='../../../static/icon/loginIn.png'
          /><br>
          请登入管理员账号
        </span>
      </template>
      <template v-if="logined">
        <span
          class="button"
        >
          <image
            class="icon" 
            src='../../../static/icon/replace.png'
          /><br>
          替代
        </span>
        <span
          class="button"
          style="border-left: 1px solid #ccc;border-right: 1px solid #ccc"
          @click="handleAdd"
        >
          <image
            class="icon" 
            src='../../../static/icon/add.png'
          /><br>
          新建
        </span>
        <span
          class="button"
          @click="handleSubmit"
        >
          <image
            class="icon" 
            src='../../../static/icon/submit.png'
          /><br>
          提交
        </span>
      </template>
    </view>

    <uni-popup ref="popup" type="center" :maskClick="false">
      <view class="row pop_title">
        新建权限
      </view>
      <view class="row">
        <view class="label">
          权限名称
        </view>
        <view class="value">
          <input
            v-model="qx"
            placeholder="请输入"
          />
        </view>
      </view>      
      <view class="row">
        <button type="primary" size="mini" style="width:100%" @click="handleSubmitQX">
          确认
        </button>
      </view>
		</uni-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import { getPdaRoleMenu, savePdaRoleMenu } from '@/api/api.js'

const authList = [
  {
    id: 1,
    qx: '管理员',
    permision: [
      'xxcj', 'scfc', 'cspz'
    ]
  },
  {
    id: 1,
    qx: '工程师',
    permision: [
      'xxcj', 'scfc'
    ]
  },
  {
    id: 1,
    qx: '仓库',
    permision: [
      'xxcj', 'scfc'
    ]
  },
  {
    id: 1,
    qx: '作业员',
    permision: [
      'scfc'
    ]
  }
]
export default {
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
  },
  data() {
    return {
      productName: '',
      locationFocus: false,
      loginUser: [],
      mainList: authList,
      qx: ''
    };
  },
  onShow() {
    
  },
  mounted() {
    
  },
  computed: {
    logined () {
      return this.loginUser.length === 1
    }
  },
  watch: {
    
  },
  methods: {
    handleGetScanData (data, name) {      
      if (name === 'userName') {
        // 校验登陆账号
        this.loginUser.push('小王')
      } else {
        this[name] = data
      }
    },
    handleScan (name) {
      // #ifdef APP-PLUS
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
        success: (res) => {
          this.handleGetScanData(res.result, name)
        },
        fail: (res) => {
          uni.showToast({
            title: '扫描失败',
            duration: 2000,
            icon: "none",
          })
        }
      })
      // #endif
      // #ifdef H5
      this.handleGetScanData('测试', name)
      // #endif
    },
    goToPage(url) {
      uni.navigateTo({
        url,
      })
    },
    handleClickTd (item, index, field) {
      if (item.permision.includes(field)) {
        item.permision = item.permision.filter(d => d !== field)
      } else {
        item.permision.push(field)
      }
    },
    handleDel (index) {
      this.mainList.splice(index, 1)
    },
    handleSubmit () {
      // 缓存 || 数据库交互
      uni.showToast({
        title: '提交成功',
        duration: 2000,
        icon: "none",
      })
    },
    handleAdd () {
      this.qx = ''
      this.$refs.popup.open()
    },
    handleSubmitQX () {
      if (!this.qx) {
        uni.showToast({
          title: '请输入权限名称',
          duration: 2000,
          icon: "none",
        })
        return false
      }
      this.mainList.push({
        qx: this.qx,
        permision: []
      })
      this.$refs.popup.close()
    }
  },
};
</script>

<style lang="scss">
.scanBox{
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  background: #fff;
  line-height: 100rpx;
}
.scanInput{
  height: 100rpx;
  flex: 1;
  padding: 0 10rpx;
}
.scan {
  
}

.row{
  flex: 1;
  margin: 20rpx 0;
  padding: 0 20rpx;
}
.pop_title{
  border-bottom: 1px solid #ccc; 
  justify-content: center; 
  padding: 20rpx;
  font-size: 40rpx;
}
.label{
  width: 200rpx;
  text-align: right;
  justify-content: flex-end;
  height: 100rpx;
  line-height: 100rpx;
  padding-right: 20rpx;
  font-size: 30rpx;
}
.value{
  flex-grow: 1;
}
.value input{
  flex: 1;
  border-bottom: 1px solid #ccc;
  height: 100rpx;
}

.body{
  flex-grow: 1;
  flex-direction: column;
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

.logined{
  border: 1px solid #615e5e;
  border-radius: 15px;
  width: 100px;
  height: 100px;
  background: #fff;
  margin: 50px auto;
  padding: 20px;
}
</style>

