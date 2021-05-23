<template>
  <view style="display: flex; flex:1; height: 800px;overflow:auto">
    <view class="menu">
      <!-- <view style="flex-direction: column; align-items: center;margin-bottom:60px">
        <image class="center-user-pic" src="../../static/IP.png"></image>
      </view>
      <view class="menu_list">
        <view 
          v-for="(item, index) in menus"
          :key="index"
          class="menu_item"
          @click="goToPage(item.url)">
          <image 
            v-if="item.icon"
            class="menu_item-icon" 
            :src="'../../static/icon/' + item.icon + '.png'"
          />
          <text class="menu_item-title">
            {{ item.title }}
          </text>        
        </view>
      </view> -->
      <view class="menu__list" v-for="(menu, index) in filterMenuOnApp" :key="menu.id">
        <view 
          :class="['menu__list__label', closeIndex.includes(index) ? 'menu__list__label_close' : '']"
          @click="handleCloseIndex(index)"
        >
          {{ menu.title }}
        </view>
        <view v-show="!closeIndex.includes(index)" class="menu__list__items">
          <view class="grid">
            <view
              v-for="(childMenuItem, childrenIndex) in menu.children"
              :key="childMenuItem.id"
              class="grid-c-04"
              @click="goToPage(childMenuItem.url)"
            >
              <image 
                :src="'../../static/image/' + (childMenuItem.icon || childrenIndex + 1) + '.png'"
              ></image>
              <view>{{ childMenuItem.title }}</view>
            </view>
            <view
              v-if="!menu.children.length"
              class="no-menu"
            >
              <image class="no-menu-image" src="../../static/no-menu.png"></image>
              <view class="no-menu-label">
                未配置菜单
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="!filterMenuOnApp.length" class="menu__list">
        <view class="menu__list__items">
          <view class="no-menu">
            <image class="no-menu-image" src="../../static/no-menu.png"></image>
            <view class="no-menu-label">
              未配置菜单
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>  
</template>

<script>
import Voice from '@/utils/voice.js'
import menu from './menu.js'

export default {
  data() {
    return {
      curLabel: "",
      closeIndex: [],
      menus: [
        {
          title: '信息采集',
          icon: 'info',
          url: '/pages/views/info/collect'
        },
        {
          title: '生产防错',
          icon: 'product',
          url: '/pages/views/provideError/index'
        },
        {
          title: '上料记录',
          icon: 'product',
          url: '/pages/views/report/pdaScanHistoryList'
        },
        // {
        //   title: '生产报表',
        //   icon: 'report',
        //   url: ''
        // },
        // {
        //   title: '物料入库',
        //   icon: '',
        //   url: ''
        // },
        {
          title: '参数设置',
          icon: 'setting',
          url: '/pages/views/setting/index'
        },
        {
          title: '服务器配置',
          icon: '',
          url: '/pages/login/servconfig'
        }
      ],
      filterMenuOnApp: menu
    };
  },
  onShow() {
    
  },
  onReady() {
    const title = `AVOLT`
    uni.setNavigationBarTitle({
      title,
    })
  },
  computed: {
    
  },
  methods: {
    handleCloseIndex (index) {
      const i = this.closeIndex.findIndex(d => d === index)
      i > -1 ? this.closeIndex.splice(i, 1) : this.closeIndex.push(index)
    },    
    getMenuList() {},
    setlabel(label) {
      this.curLabel = this.$t(label);
    },
    goToPage(url) {
      if (!url) {
        this.test('开发中...')
        return
      }
      uni.navigateTo({
        url,
        success: () => {
          // uni.setNavigationBarTitle({
          //   title: `${this.curLabel}`,
          // })
        },
      });
    },

    test (voice) {
      Voice(voice)    
    }
  },
  onNavigationBarButtonTap(val) {
    console.log(val)
  },  
};
</script>

<style lang="scss" scoped>
.menu {
  flex-direction: column;
  padding: 10rpx 10rpx;
  width: 100%;

  &__list {
    flex-direction: column;
    background-color: #fff;
    width: 100%;
    margin: 0 0 10rpx;
    border-radius: 10rpx;

    &__label {
      padding: 16rpx 60rpx;
      // background-color: #efefef;
      font-size: 40rpx;
      color: #333;
      border-bottom: 1px solid #ddd;
      background: url('../../static/menu.png') no-repeat 10rpx center, url('../../static/bottom.png') no-repeat calc(100% - 20rpx) center;
      background-size: 40rpx, 20rpx;
    }

    &__label_close {
      background: url('../../static/menu.png') no-repeat 10rpx center, url('../../static/right.png') no-repeat calc(100% - 20rpx) center;
      background-size: 40rpx, 20rpx;
    }

    &__items {
      flex-direction: column;
      padding: 32rpx 0 0;
      border-bottom: 1px solid #ddd;

      .grid-c-04 {
        flex-flow: column;
        align-items: center;
        text-align: center;
        margin-bottom: 32rpx;

        image {
          width: 120rpx;
          height: 120rpx;
        }

        view {
          padding-top: 16rpx;
          color: #666;
          font-size: 24rpx;
        }
      }
    }
  }
}

.pc {
  .menu {
    &__list {
      width: 100%;
    }
  }
}
.no-menu{
  width: 100%;
  flex-direction: column;
  padding: 20rpx;
  text-align: center;

  &-image{
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }
  &-label{
    font-size: 20rpx;
    color: #ccc;
    justify-content: center;
  }
}

.dropDown-menu{
  text-align: center;
  font-size: 30rpx;
  line-height: 60rpx;
  height: 60rpx;
  color: #7b7b7b;
  padding: 0 40rpx;
}

.dropDown-icon{
  color: #ccc;
  font-size: 40rpx;
  margin-right: 20rpx;
  vertical-align: middle;
}
</style>
