<template>
  <view class="login">
    <view class="login__form">
      <view class="input-wrapper">
        <view class="label-view">
          <text class="label">{{ $t("lang.ot.app.accountNumber") }}</text>
        </view>
        <view style="flex-direction: column; flex: 1">
          <uni-combox
            label=""
            :upperCase="false"
            :candidates="candidates"
            :inputChange="true"
            :value="formData.username"
            @input="handleUserInput"
            :placeholder="$t('lang.ot.app.pleaseEnterUserName')"
          ></uni-combox>
        </view>
        <!-- <input class="input" type="text" :value="formData.username" :placeholder="$t('lang.ot.app.pleaseEnterUserName')" @input="handleInput($event, 'username')" /> -->
      </view>
      <view class="input-wrapper">
        <view class="label-view">
          <text class="label">{{ $t("lang.ot.app.password") }}</text>
        </view>
        <input
          class="input"
          style="padding-left: 16rpx"
          type="password"
          :value="formData.password"
          :placeholder="$t('lang.ot.app.pleaseEnterYourPassword')"
          @input="handleInput($event, 'password')"
        />
      </view>
      <!-- #ifdef H5 -->
      <view class="input-wrapper">
        <view class="label-view">
          <text class="label">{{ $t("lang.ot.app.identificationCode") }}</text>
        </view>
        <input
          class="input"
          style="padding-left: 16rpx"
          :value="ANDROID_ID"
          @input="handleInputKey"
        />
      </view>
      <!-- #endif -->
      <view class="input-wrapper">
        <view class="label-view">
          <text class="label">{{ $t("lang.ot.app.language") }}</text>
        </view>
        <view>
          <radio-group @change="langChange">
            <label class="radio">
              <radio value="zh" :checked="lang === 'zh'" />{{
                $t("lang.ot.app.Chinese")
              }}
            </label>
            <label class="radio">
              <radio value="en" :checked="lang === 'en'" />{{
                $t("lang.ot.app.English")
              }}
            </label>
          </radio-group>
        </view>
      </view>
      <view class="input-wrapper">
        <checkbox-group>
          <label @click="handleCheck('autoLogin')">
            <checkbox value="autoLogin" :checked="autoLogin" />{{
              $t("lang.ot.app.autoLogin")
            }}
          </label>
          <label @click="handleCheck('rememberPassword')">
            <checkbox value="rememberPassword" :checked="rememberPassword" />{{
              $t("lang.ot.app.rememberPassword")
            }}
          </label>
        </checkbox-group>
      </view>
      <view class="button-wrapper">
        <button
          type="primary"
          class="login__submit"
          @click="login"
          :disabled="loading"
          :loading="loading"
          formType="submit"
        >
          {{ $t("lang.ot.app.login") }}
        </button>
      </view>

      <!-- #ifdef APP-PLUS -->
      <view class="button-wrapper">
        {{ $t("lang.ot.app.theCurrentDeviceIsUnique") }}：{{ ANDROID_ID }}
      </view>
      <!-- #endif -->
    </view>
    <view v-if="version" class="version">version: {{ version }}</view>
    <view class="btn-area">
      <navigator url="/pages/login/servconfig">
        <text class="serv">
          {{ $t("lang.ot.app.serverConfig") }}
          <span v-if="serName">({{ serName }})</span>
        </text>
      </navigator>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { login, getOperateList, workOrderStateMachine } from "@/api/remote.js";
import i18n from "@/i18n/index.js";
import md5 from "@/utils/md5.js";

export default {
  data() {
    return {
      loading: false,
      checks: [],
      formData: {
        username: "",
        password: "",
      },
      autoLogin: false,
      rememberPassword: false,
      userList: [],
      candidates: [],
      operateList: [],
      version: "",
      servList: [
        {
          value: "https://opentask-dev.hcs-open.com",
          name: "内部测试",
        },
      ],
    };
  },
  computed: {
    ...mapState([
      "ANDROID_ID",
      "lang",
      "langPack",
      "shouldAutoLogin",
      "newsRefreshTime",
    ]),
    serName() {
      let item = this.servList.find((d) => d.value === this.$store.state.serv);
      return item ? item.name : "";
    },
  },
  onShow() {
    // #ifdef APP-PLUS
    this.getAndroidId();
    // #endif
    this.updateState({
      ANDROID_ID: "87B8A2CC6DA91A70",
    });
    if (uni.getStorageSync("userList")) {
      this.userList = JSON.parse(uni.getStorageSync("userList"));
      this.candidates = this.userList.map((item) => item.username);
    }
    if (uni.getStorageSync("rememberPassword")) {
      this.rememberPassword = true;
    }
    if (uni.getStorageSync("username")) {
      this.formData.username = uni.getStorageSync("username");
    }
    if (uni.getStorageSync("password")) {
      this.formData.password = uni.getStorageSync("password");
    }
    this.$setTitle("lang.ot.app.login");
    const { username, password } = this.formData;
    if (uni.getStorageSync("autoLogin")) {
      this.autoLogin = true;
      if (this.shouldAutoLogin && username && password) {
        this.login();
      }
    }
  },
  methods: {
    ...mapMutations(["updateState", "updateLang", "setTab"]),
    handleInputKey(e) {
      this.updateState({
        ANDROID_ID: e.detail.value,
      });
    },
    handleInput(event, name) {
      const { value } = event.detail;
      this.formData[name] = value;
    },
    handleUserInput(e) {
      this.formData.username = e;
      const user = this.userList.find((item) => item.username === e);
      if (user) {
        this.formData.password = user.password;
      }
    },
    handleCheck(name) {
      if (name === "autoLogin") {
        if (!this.autoLogin) {
          this.rememberPassword = true;
        }
      } else {
        if (this.autoLogin) {
          this.autoLogin = false;
        }
      }
      this[name] = !this[name];
    },
    async login() {
      const { username, password } = this.formData;
      if (!username) {
        uni.showToast({
          title: this.$t("lang.ot.app.usernameCanNotBeEmpty"),
          icon: "none",
        });
        return false;
      }
      if (!password) {
        uni.showToast({
          title: this.$t("lang.ot.app.passwordCanNotBeEmpty"),
          icon: "none",
        });
        return false;
      }
      // #ifdef H5
      if (!this.ANDROID_ID) {
        uni.showToast({
          title: this.$t("lang.ot.app.identificationCode"),
          icon: "none",
        });
        return false;
      }
      // #endif
      this.loading = true;
      const res = await login({
        username,
        password: md5.hex_md5(password),
      });
      const userInfo = {
        accessToken: res.data,
      };
      if (res.code === "sso.ok") {
        // 自动登录
        if (this.autoLogin) {
          uni.setStorageSync("autoLogin", "1");
          this.updateState({
            shouldAutoLogin: true,
          });
          uni.setStorageSync("rememberPassword", "1");
          uni.setStorageSync("password", password);
          uni.setStorageSync("username", username);
        } else {
          uni.setStorageSync("autoLogin", "");
          this.updateState({
            shouldAutoLogin: false,
          });
        }
        const index = this.userList.findIndex(
          (user) => user.username === username
        );
        // 记住密码
        if (this.rememberPassword) {
          uni.setStorageSync("rememberPassword", "1");
          uni.setStorageSync("password", password);
          uni.setStorageSync("username", username);
          if (index > -1) {
            this.userList.splice(index, 1, {
              username,
              password,
            });
          } else {
            this.userList.push({
              username,
              password,
            });
          }
        } else {
          uni.setStorageSync("rememberPassword", "");
          uni.setStorageSync("password", "");
          uni.setStorageSync("username", "");
          if (index > -1) {
            this.userList.splice(index, 1, {
              username,
              password: "",
            });
          } else {
            this.userList.push({
              username,
              password: "",
            });
          }
        }
        uni.setStorageSync("userList", JSON.stringify(this.userList));
        const { accessToken } = userInfo;
        this.updateState({
          accessToken,
        });
        this.getWorkOrderStateMachine()
        this.setTab()
        await this.getOperateList()
        if (this.operateList.length) {
          uni.reLaunch({
            url: "/pages/operateList/index",
          })
        } else {
          uni.reLaunch({
            url: "/pages/menu/menu",
          })
        }
      }
      this.loading = false;
    },
    getAndroidId() {
      if (plus) {
        const Settings = plus.android.importClass("android.provider.Settings");
        const main = plus.android.runtimeMainActivity();
        const androidId = Settings.Secure.getString(
          main.getContentResolver(),
          Settings.Secure.ANDROID_ID
        );
        this.updateState({
          ANDROID_ID: androidId.toUpperCase(),
        });

        plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
          this.version = wgtinfo.version; //应用版本号
        });
      }
    },    
    async getOperateList() {
      const res = await getOperateList({
        pageNo: 1,
        pageSize: 10000
      })
      if (res.data) {
        this.operateList = res.data.data
      }
    },
    getWorkOrderStateMachine() {
      workOrderStateMachine().then((res) => {
        if (res.code === 'ok') {
          this.updateState({
            stateMachineList: res.data
          })
        }
      })
    },
    langChange(e) {
      this.updateLang(e.detail.value);
      this.$setTitle("lang.ot.app.login");
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
/* 登录 */

.login {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 750rpx;
  padding-top: 100rpx;

  .input-wrapper {
    border-bottom-style: solid;
    border-bottom-width: 1rpx;
    border-bottom-color: #ddd;
    background-color: #fff;
    flex-direction: row;
    width: 650rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-left: 50rpx;
  }

  &__submit {
    width: 100%;
  }

  &__form {
    flex-direction: column;
  }

  .android-id {
    align-items: center;
    flex-direction: column;
  }

  radio-group {
    font-size: 20rpx;
    line-height: 40rpx;

    label {
      margin-right: 16px;
    }
  }

  checkbox-group {
    font-size: 20rpx;
    line-height: 40rpx;

    label {
      margin-right: 16px;
    }
  }

  .version {
    position: absolute;
    bottom: 16rpx;
    text-align: center;
    left: 0;
    width: 100%;
    justify-content: center;
  }
}

.label-view {
  width: 90rpx;
  height: 60rpx;
  align-items: center;
  margin-right: 30rpx;
}

.label {
  flex: 1;
  line-height: 60rpx;
  font-size: 20rpx;
  color: #555;
  text-align: left;
}

.input {
  flex: 1;
  height: 60rpx;
  font-size: 20rpx;
  align-items: center;
}

.button-wrapper {
  width: 650rpx;
  margin: 50rpx;
  box-sizing: border-box;
  flex-direction: column;
}

.pc {
  .login {
    width: 100%;
    padding-left: 30px;
    padding-right: 30px;
    .input-wrapper {
      width: 100%;
      margin-left: 0;
    }
  }
  .button-wrapper {
    width: auto;
  }
}

.serv {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  color: #1890ff;
  font-size: 20rpx;
}
</style>
