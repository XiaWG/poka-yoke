<template>
	<view class="search list-detail">
    <view class="grid">
    <template
      v-for="(item, index) in columns"
    >
      <view :key="index" class="grid-c-06">
        <view class="search__label">
          {{ item.label }}
        </view>
        <view class="search__value">
          {{ getDescFromDataSource(item, model[item.key]) || '--' }}
        </view>
      </view>
    </template>
    </view>
	</view>
</template>

<script>
  import dataSource from "@/config/dataSource.js";
	export default {
    name: 'comDetail',
    props: {
      columns: {
        type: Array,
        default: () => ([])
      },
      model: {
        type: Object,
        default: () => ({})
      },
      customSetting: {
        type: Object,
        default: () => ({})
      },
    },
    components: {},
    computed: {      
      dataSource () {
        if (this.customSetting.dataSource) {
          return Object.assign({}, dataSource, this.customSetting.dataSource)
        }
        return dataSource
      },
    },
		data() {
			return {
        
			}
		},
		methods: {
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
		}
	};
</script>

<style lang="scss">
	.list-detail {
		width: 100%;
		flex-direction: column;
		padding: 16rpx 0;
	}
</style>
