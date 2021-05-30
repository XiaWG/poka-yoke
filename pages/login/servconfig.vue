<template>
  <view class="container">
    <!-- <view class="item">
      <view class="title">
        基础服务器(用于登录)
      </view>
      <view>
        <input
          class="input"
          v-model="defaultServ"
          placeholder="请输入服务器地址"
        />
      </view>
    </view>  -->
    <view class="item">
      <view class="title">
        主服务器
      </view>
      <view class="selItem">
        <radio-group @change="radioChange">
          <label
            v-for="(item, index) in servList"
            :key="item.value"
          >
            <view>
              <radio :value="item.value" :checked="index === current" />
              {{ item.name }}
            </view>
          </label>
        </radio-group>
      </view>
      <view>
        <input
          class="input"
          v-model="currentServ"
          placeholder="请选择服务器或者输入服务器地址"
        />
      </view>
    </view>      
    <view class="item">
      <button type="primary" class="button" @click="setServ">
        {{ $t("lang.ot.app.determine") }}
      </button>
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      current: null,
      defaultServ: this.$store.state.defaultServ,
      currentServ: this.$store.state.serv,
      servList: [
        {
          value: "http://www.automationmes.com:8787",
          name: "内部测试",
        }
      ],
    };
  },
  computed: {},
  onShow() {
    this.current = this.servList.findIndex(
      (d) => d.value === this.$store.state.serv
    );
  },
  methods: {
    ...mapMutations(["updateState"]),
    radioChange(evt) {
      for (let i = 0; i < this.servList.length; i++) {
        if (this.servList[i].value === evt.target.value) {
          this.current = i;
          this.currentServ = this.servList[i].value;
          break;
        }
      }
    },
    setServ() {
      this.$store.commit("SETSERV", this.currentServ);
      this.$store.commit("SETDEFAULTSERV", this.defaultServ);
      
      this.updateState({
        accessToken: "",
        menus: [],
        shouldAutoLogin: false,
      });
      uni.reLaunch({
        url: `/pages/menu/menu`,
      });
    },
  },
  created() {},
  onNavigationBarButtonTap(e) {
    this.$store.commit('showKeyboard/SET_KEYBOARD_TIMER', true)
	},
};
</script>

<style lang="scss" scoped>
  .container{
    width: 95%;
    margin: 0 auto;
    flex-direction: column;

    .item{
      width: 100%;
      background: #fff;
      margin: 10px 0;
      flex-direction: column;
      border-radius: 10rpx;

      .title{
        font-size: 30rpx;
        width: 100%;
        padding: 20rpx;
        border-bottom: 1px solid #ccc;
      }

      .selItem{
        font-size: 30rpx;
        width: 100%;
        padding: 20rpx;
        border-bottom: 1px solid #ccc;
      }

      .input{
        width: 100%;
        padding: 20rpx;
      }

      .button{
        width: 100%;
      }
    }
  }
</style>
