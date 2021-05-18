<template>
  <view class="list-box">
    <view class="list-header">
      <slot name="list-header"></slot>
    </view>
    <view class="list-body">
      <t-table :min-width="tableWidth + 'px'">
        <t-tr>
          <t-th v-if="selectable" :width="30" class="checkCol">
            <checkbox 
              v-if="multiple"
              :checked="selectAll"
              @click="handleSelectAll"
            />
            <span v-else>#</span>
          </t-th>
          <template v-for="(item, index) in columns">
            <t-th :width="item.width" :key="index">{{ item.label }}</t-th>
          </template>
          <t-th v-if="operationPos === 'row' && operation.length" :width="100">
            {{ $t('lang.ot.app.operate') }}
            <!-- 操作 -->
          </t-th>
        </t-tr>
        <template v-if="data.length">
          <template
            v-for="(item, index) in data"
          >
            <t-tr
              @click.native="handleToDetail(item)"
              :key="index"
            >
              <t-td v-if="selectable" :width="30" class="checkCol">
                <checkbox
                  :checked="item.selected"
                  @click="handleSelect(item, index)"
                />
              </t-td>
              <template v-for="(column, columnIndex) in columns">
                <t-td
                  :width="column.width" 
                  :key="columnIndex"
                >
                  <!-- type: 1 纯文本展示多个字段 -->
                  <template v-if="column.type===1">
                    <template 
                      v-for="(field, _index) in column.fields"
                    >
                      <span
                        :key="_index"
                      >
                        {{ field.type === 2 ? getDescFromDataSource(field, item[field.key]) : item[field.key] }}
                      </span>
                    </template>
                  </template>
                  <!-- type: 2 需要转义的纯文本展示 自定义组件 -->
                  <template v-else-if="column.type===2">
                    <component
                      v-if='column.component'
                      :is="column.component" 
                      :options="column"
                      :model="item"
                      :text="getDescFromDataSource(column, item[column.key])"
                    />
                    <span
                      v-else
                    >
                      {{ getDescFromDataSource(column, item[column.key]) }}
                    </span>
                  </template>
                  <!-- type: 3 时间类型 -->
                  <template v-else-if="column.type===3">
                    {{ item[column.key] | formatterTime }}
                  </template>
                  <!-- type: 4 input组件 -->
                  <template v-else-if="column.type===4">
                    <input type="text" 
                      :value="item[column.key]"
                      :placeholder="$t('lang.ot.app.input')"
                      @input="handleInput($event.target.value, column, index)"
                    />
                  </template>
                  <!-- type: 5 弹框类选择输入 linkAble最终决定是否可弹框选择 -->
                  <template v-else-if="column.type===5">
                    <template v-if="column.linkAble">
                      <template v-if="column.linkAble(item)">
                        <view
                          class="link"
                          @click.stop="handlePop(column, item, item[column.key], index)"
                        >
                          {{ item[column.key] || $t('lang.ot.app.select') }}
                        </view>
                      </template>
                      <template v-else>
                        <view>
                          {{ item[column.key] }}
                        </view>
                      </template>
                    </template>
                    <template v-else>
                      <view
                        class="link"
                        @click.stop="handlePop(column, item, item[column.key], index)"
                      >
                        {{ item[column.key] || $t('lang.ot.app.select') }}
                      </view>
                    </template>
                  </template>
                  <!-- type: 6 render -->
                  <template v-else-if="column.type===6">
                    <custom-render :options="column" :model="item"/>
                  </template>
                  <!-- 默认 纯文本展示 -->
                  <template v-else>
                    {{ item[column.key] }}
                  </template>
                </t-td>
              </template>
              <t-td v-if="operationPos === 'row' && operation.length" :width="100">
                <button
                  v-for="(b, i) in operation"
                  v-show="btnVisiable(b, item)"
                  :disabled="btnDisable(b, item)"
                  :key="i"
                  :size="b.size || 'mini'"
                  :type="b.type || 'default'"
                  :style="b.style"
                  :class="[btnDisable(b, item) ? 'disabled' : '']"
                  @click="handleOperate(b, item)"
                >
                  {{ b.label }}
                </button>
              </t-td>
            </t-tr>
            <t-tr 
              v-if="expandable"
              :key="'expand' + index"
              style="border: 0"
            >
              <t-td
                align="left"
                :colspan="colspan"
              >
                <template v-if="operationPos === 'expand'">
                  <button
                    v-for="(b, i) in operation"
                    v-show="btnVisiable(b, item)"
                    :disabled="btnDisable(b, item)"
                    :key="i"
                    :size="b.size || 'mini'"
                    :type="b.type || 'default'"
                    :style="b.style"
                    :class="[btnDisable(b, item) ? 'disabled' : '']"
                    @click="handleOperate(b, item)"
                    style="margin: 0 5px"
                  >
                    {{ b.label }}
                  </button>
                </template>
              </t-td>
            </t-tr>
          </template>
        </template>
        <tr v-else style="height:168px">
          <view class="no-data">{{ $t("lang.ot.app.noData") }}</view>
        </tr>
      </t-table>
    </view>
    <view v-if="pagePlugin && data.length" class="list-bottom">
      <text class="more" @click="getMore">{{ getMoreTitle }}</text>
    </view>

    <!-- 弹框类搜索类弹框 全屏 支持插槽 -->
    <uni-popup class="list-dialog" ref="popup" type="fullScreen" :maskShow="false" @change="openCallback">
      <template v-if="curEdit && !curEdit.col.slot">
        <view style="padding: 20rpx;">
          <input class="searchKey"
            v-model="searchKey"
            @input="handleSearch"
          />
          <span class="searchClose" @click="handlePopClose">
            {{ $t('lang.ot.app.cancel') }}
          </span>
        </view>
        <view v-if="panelList.length" class="list-panel">
          <scroll-view scroll-x style="min-width: 100%">
            <view 
              v-for="(t, i) in panelList"
              :key="i"
              :class="['list-panel-item', i=== activeIndex ? 'active': '']"
              @click="handleSelPanel(i, t)"
            >
              <span
                v-if="t.icon"
                :class="['icon', t.icon]"
              ></span>
              {{ t.label }}
            </view>
          </scroll-view>
        </view>
        <view style="height:100%; flex-direction: column;">
          <scroll-view scroll-y class="list-scroll" :style="listScrollStyle">
            <view
              v-for="(item, index) in searchData"
              :key="index"
              class="searchTxt"
            >
              <template
                v-if="curEdit.col.multiple"
              >
                <!-- 已选择panel 不展示选择框 -->
                <checkbox
                  v-if="panelList.length ? panelList[activeIndex].key !== '_ed' : true"
                  style="width: 24px; height:24px"
                  :checked="item.selected"
                  @click="handleSelItem(item)"
                />
                <view
                  style="width:100%; line-height: 24px; padding-left: 10px;"
                  @click="handleToDel(index)"
                >
                  {{ panelList.length ? item[panelList[activeIndex].search.labelKey] : item[curEdit.col.search.labelKey] }}
                </view>
                <view 
                  v-if="item.__toDel"
                  class="toDel"
                  @click="handleDelItem($event, index)"
                >
                  {{ $t('lang.ot.app.delete') }}
                  <!-- 删除 -->
                </view>
              </template>
              <view
                v-else
                style="width:100%"
                @click="handleSecSearchItem(item)"
              >
                {{ panelList.length ? item[panelList[activeIndex].search.labelKey] : item[curEdit.col.search.labelKey] }}
              </view>
            </view>
            <view
              v-if="!searchData.length"
              class="no-data"
            >
              {{ $t("lang.ot.app.noData") }}
            </view>
          </scroll-view>
          <view
            v-if="curEdit.col.multiple"
            style="height: 40px; margin-top: 5px;"
          >
            <button
              type="primary"
              @click="handleSelSubmit"
            >
              {{ $t('lang.ot.app.determine') }}
              <!-- 确定 -->
            </button>
          </view>
        </view>
      </template>
      <slot name="dialog"></slot>
    </uni-popup>
    <view v-show="showLoading" class="list-loading">
      <view v-show="showMask" class="list-loading-mask"></view>
      <view class="list-loading-png">
        <image
          style="width: 80rpx; height: 80rpx"
          src="../../static/Loading.png"
        />
      </view>
    </view>
  </view>
</template>

<script>
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
import comTag from "./components/tag.vue";
import customRender from "./components/customRender.vue";
import dataSource from "@/config/dataSource.js";
import { debounce } from '@/utils/util.js';
import request from "@/utils/request";
export default {
  name: 'comList',
  props: {
    columns: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Array,
      default: () => ([])
    },
    customSetting: {
      type: Object,
      default: () => ({})
    },
    selectable: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    pagePlugin: {
      type: Boolean,
      default: false
    },
    moreTitle: {
      type: String,
    },
    query: {
      type: Function
    }
  },
  components: {
    tTable,
    tTh,
    tTr,
    tTd,
    comTag,
    customRender
  },
  data () {
    return {
      selectAll: false,
      searchKey: '',
      searchData: [],
      curEdit: null,
      activeIndex: 0,
      selections: [], // 弹框类多选是已选项
      showLoading: false,
      showMask: false
    }
  },
  computed: {
    getMoreTitle () {
      return this.moreTitle || this.$t('lang.ot.app.loadMore')
    },
    tableWidth () {
      return this.columns.reduce((a, b) => {
        return a + b.width;
      }, 0);
    },
    dataSource () {
      if (this.customSetting.dataSource) {
        return Object.assign({}, dataSource, this.customSetting.dataSource)
      }
      return dataSource
    },
    operationPos () {
      return this.customSetting.operationPos || 'row'
    },
    operation () {
      return this.customSetting.operation || []
    },
    colspan () {
      let length = this.selectable ? 1 : 0
      length = this.columns.reduce((a, b) => {
        // 根据列的可见性计算 UNDO
        return a + 1
      }, length)
      length = this.customSetting.operationPos === 'expand' ? length + 1 : length
      return length
    },
    panelList () {
      this.activeIndex = 0
      // if (this.curEdit) {
      //   // 判断是否为数组
      //   console.log(this.curEdit.col.search instanceof Array) // web: true ; app: false ???
      //   console.log(this.curEdit.col.search.__proto__ === Array.prototype) // web: false ; app: false ???
      //   console.log(this.curEdit.col.search.constructor === Array) // web: true ; app: false ???
      //   console.log(Object.prototype.toString.call(this.curEdit.col.search) === '[object Array]') // true
      //   console.log(Array.isArray(this.curEdit.col.search)) // true
      // }
      // 多选状态下 默认有已选择列表
      const list = []
      if (this.curEdit.col.multiple) {
        list.push({
          icon: 'filter',
          key: '_ed',
          label: this.$t('lang.ot.app.selected'), // 已选择
          search: {
            labelKey: 'sel__Name',
          }
        })
      }
      if (this.curEdit && Array.isArray(this.curEdit.col.search)) {
        this.curEdit.col.search.forEach((d, i) => {
          list.push({
            key: i,
            label: d.panelTitle,
            search: d
          })
        })
      } else if (this.curEdit.col.multiple) {
        list.push({
          key: 0,
          label: this.curEdit.col.search.panelTitle || this.curEdit.col.label,
          search: this.curEdit.col.search
        })
      }
      return list
    },
    listScrollStyle () {
      let _h = 120
      if (this.panelList.length) {
        _h += 60
      }
      if (this.curEdit.col.multiple) {
        _h += 80
      }
      let height = `calc(100% - ${_h}rpx)`
      return { height } 
    }
  },
  watch: {
    data: {
      handler: function(v) {
        if (v.length === 0) {
          this.selectAll = false
        }
      },
      deep: true
    }
  },
  created () {
    
  },
  mounted () {
    
  },
  methods: {
    handleToDetail (row) {
      this.$emit('handleToDetail', row)
    },
    handleSelectAll () {
      this.selectAll = !this.selectAll
      this.selectAllData(this.selectAll)
      this.$emit('handleSelectAll')
    },
    handleSelect (row, index) {
      row.selected = !row.selected
      let _selectAll = row.selected
      if (_selectAll) {
        for (let i = 0; i < this.data.length; i++) {
          if (!this.multiple) {
            if (index === i) continue
            this.data[i].selected = false
            _selectAll = false
          } else {
            if (!this.data[i].selected) {
              _selectAll = false
              break
            }
          }
        }
      }
      this.selectAll = _selectAll
      this.$emit('handleSelect', row)
    },
    handlePop (col, row, value, index) {
      this.curEdit = {col, row, value, index}
      this.selections = []
      // 存在多选时 selections 赋值
      if (this.panelList.length && col.getDefaultSelection) {
        this.selections = [...col.getDefaultSelection(row)]
      }
      this.searchKey = ''
      this.searchData = []
      this.$refs.popup.open()
      this.$emit('handlePop', this.curEdit)
    },
    openCallback (data) {
      if (data.show) {
        this.$nextTick(() => {
          this.handleSelPanel(1)
        })
      }
    },
    handleSelPanel (i, t) {
      this.searchKey = ''
      this.searchData = []
      this.activeIndex = i
      if (t && t.key === '_ed') {
        this.searchData = this.selections
      } else if (this.curEdit.col.defaultShowAllData) {
        this.handleSearch({detail: { value: ''}})
      }
    },
    handleToDel (index) {
      if (this.panelList[this.activeIndex].key === '_ed') {
        this.searchData = this.selections.map((d, i) => {
          d.__toDel = i === index ? !d.__toDel : false
          return d
        })
      }
    },
    handleDelItem (e, i) {
      e.stopPropagation()
      this.selections.splice(i, 1)
      this.searchData = this.selections.map(d => {
        d.__toDel = false
        return d
      })
    },
    handlePopClose () {
      this.$refs.popup.close()
    },
    handleOperate (btn, row) {
      this.$emit(btn.action, row)
    },
    handleSearch (v) {
      let search = this.panelList.length ? this.panelList[this.activeIndex].search : this.curEdit.col.search
      if (!search.url) return
      const searchData = {
        searchKey: v.detail.value
      }
      const params = typeof(search.params) === 'function' ? search.params(this.curEdit.row) : search.params
      const options = {
        method: search.method,
        params: search.method === 'get' ? Object.assign({}, params, searchData) : {},
        body: search.method === 'post' ? Object.assign({}, search.data, searchData) : {},
        default_url: search.default_url
      }
      this.showLoading = true
      // debugger
      request(search.url, options).then(res => {        
        if (res.data) {
          const data = search.pagination ? res.data.data : res.data
          const ret = data.map(d => {
            const _ind = this.selections.findIndex(t => (t._$id === d[search.key] && t.__type === search.__type))
            d.selected = (_ind > -1)
            return d
          })
          this.searchData = ret
        }
        this.showLoading = false
      }).catch(() => {
        this.searchData = []
        this.showLoading = false
      })
      this.$emit('handleSearch', v.detail.value)
    },
    handleSecSearchItem (data) {
      const { col, index } = this.curEdit
      if (col.display) {
        col.display(col, index, data)
      }
      this.$refs.popup.close()
      // let search = this.panelList.length ? col.search[this.activeIndex] : col.search
      // this.data[index][key] = data[search.key]
      // this.$set(this.data[index], showKey, data[search.labelKey])
    },
    handleSelItem (item) {
      item.selected = !item.selected
      let search = this.panelList.length ? this.panelList[this.activeIndex].search : this.curEdit.col.search
      if (item.selected) {
        this.$set(item, '__type', search.__type)
        this.$set(item, '__toDel', false)
        this.$set(item, 'sel__Name', item[search.labelKey])
        this.$set(item, '_$id', item[search.key])
        this.selections.push(item)
      } else {
        const ind = this.selections.findIndex(d => (d._$id === item[search.key]))
        this.selections.splice(ind, 1)
      }
    },
    // 列表多选执行确认按钮
    handleSelSubmit () {
      const selections = this.selections
      this.handleSecSearchItem(selections)
    },
    selectAllData (v) {
      this.data.map(d => {
        d.selected = v
        return d
      })
    },
    /**
     * col: 列属性
     * value: 
     */
    getDescFromDataSource (col, value) {
      if (!value) return ''
      if (!col.dataSource) return value
      const curList = this.dataSource[col.dataSource]
      if (curList && curList.length) {
        const item = curList.find(d => d.value.toLocaleLowerCase() === value.toLocaleLowerCase())
        if (item) {
          if (typeof(item.label) === 'String') {
            return item.label
          } else {
            return item.label[this.$store.state.lang]
          }
        } else {
          return value
        }
      } else {
        return value
      }
    },
    getMore () {
      this.$emit('getMore')
    },
    // 获取勾选项
    getSelection () {
      return this.data.filter((d,i) => {
        d.$index = i
        return d.selected
      })
    },
    // 按钮可见状态
    btnVisiable (btn, item) {
      return typeof(btn.visiable) === 'boolean' ? btn.visiable : typeof(btn.visiable) === 'function' ? btn.visiable(item) : true
    },
    // 按钮disable状态
    btnDisable (btn, item) {
      return typeof(btn.disable) === 'boolean' ? btn.disable : typeof(btn.disable) === 'function' ? btn.disable(item) : false
    },
    // Input 类组件 输入
    handleInput (v, col, index) {
      this.$set(this.data[index], col.key, v)
    }
  }
}
</script>

<style lang="less" scoped>
  .list-loading{
    position: fixed;
    width:100%;
    height:100%;
    top: 0;
    left: 0;
    z-index: 1001;
    justify-content: center;
    align-items: center;
  }
  .list-loading-mask{
    background: #000;
    opacity: 0.5;
    width:100%;
    height:100%;
  }
  .list-loading-png{
    width: 200rpx;
    height: 150rpx;
    justify-content: center;
    align-items: center;
    background: #000;
    opacity: 0.5;
    border-radius: 10px;
    position: absolute;
  }
  .list-box{
    width:100%;
    flex-direction: column;
  }
  .list-header{
    width:100%;
    overflow: auto;
  }
  .list-body{
    width:100%;
    overflow: auto;
  }
  .list-bottom{
    width: 100%;
  }
  .checkCol{
    max-width: 35px;
  }
  .searchKey{
    border: 1px solid #ccc;
    width:calc(100% - 100rpx);
    // margin: 20rpx 0;
    border-radius: 10rpx;
    padding:10rpx 20rpx 10rpx 60rpx;
    background: url('../../static/search.png') no-repeat 20rpx center;
    background-size: 30rpx;
  }
  .searchClose{
    font-size: 28rpx;
    // margin: 20rpx 0;
    padding: 10rpx 0;
    text-align: center;
    cursor:pointer;
    color:#1890ff;
    width: 100rpx;
    display: inline-block;
  }
  .searchTxt{
    font-size: 28rpx;
    padding: 10rpx 20rpx;
    border-bottom: 1px solid #ccc;
    position: relative;
  }
  .list-scroll{
    // height: calc(100% - 120rpx);
    overflow: auto;
  }
  .list-panel{
    font-size: 28rpx;
    height: 60rpx;
    white-space:nowrap;
    padding: 0 20rpx;
  }
  .list-panel-item{
    display: inline-block;
    padding: 0 30rpx 16rpx;
    cursor: pointer;
  }
  .list-panel-item.active{
    border-bottom: 2px solid red;
    color: red
  }
  .list-panel-item .icon{
    position: absolute;
    top: 3px;
    left: 0;
    width: 15px;
    height: 15px;
  }
  .list-panel-item .filter{
    background: url('../../static/filter_b.png') no-repeat center center;
    background-size: 40rpx;
  }
  .list-panel-item.active .filter{
    background: url('../../static/filter_r.png') no-repeat center center;
    background-size: 40rpx;
  }
  .toDel{
    position: absolute;
    right:0;
    background: red;
    color: #fff;
    top: 0;
    height: 100%;
    padding: 5px 10px;
  }
  .disabled{
    opacity: 0.3;
  }
</style>
