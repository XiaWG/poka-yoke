<script>
import { checkVersion } from "@/api/remote.js";
import store from "./store/index";

export default {
  onLaunch() {
    const serv = store.state.serv;
    //#ifdef APP-PLUS
    if (plus) {
      plus.runtime.getProperty(plus.runtime.appid, async (wgtinfo) => {
        const checkRes = await checkVersion({
          version: wgtinfo.version,
        });
        if (checkRes && checkRes.update) {
          uni.showModal({
            //提醒用户更新
            title: "升级提示",
            content: "有一些数据需要升级，请点击升级按钮",
            confirmText: "升级",
            success(res) {
              if (res.confirm) {
                uni.downloadFile({
                  url: `${serv}/mes-service${checkRes.apk}`,
                  success: (downloadResult) => {
                    if (downloadResult.statusCode === 200) {
                      plus.runtime.install(
                        downloadResult.tempFilePath,
                        {
                          force: false,
                        },
                        () => {
                          plus.runtime.restart();
                        },
                        (e) => {}
                      );
                    }
                  },
                });
              } else {
              }
            },
          });
          // uni.showModal({ //提醒用户更新
          // 	title: "更新提示",
          // 	content: '有新版本发布，是否确定更新',
          // 	success(res){
          // 		if (res.confirm) {
          // 			plus.runtime.openURL(encodeURI(`${serv}/mes-service${checkRes.apk}`));
          // 			// plus.runtime.openURL(`${serv}/mes-service${checkRes.apk}`);
          // 		}else{
          // 			plus.runtime.quit();
          // 		}
          // 	}
          // })
        }
      });
    }
    //#endif
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
};
</script>

<style lang="scss">
@import "./common/common.css";

page,
view {
  display: flex;
  box-sizing: border-box;
}

page {
  display: flex;
  min-height: 100%;
  height: 100%;
  background-color: #efefef;
  box-sizing: border-box;
}

.no-data {
  flex-direction: column;
  text-align: center;
  height: 168px;
  padding:16px;
  font-size: 28rpx;
  line-height: 225px;
  width: 100%;
  color:#8a96a3;
  position: absolute;
  left: 0;
  background: url('./static/no-data.png') no-repeat center 50px;
  background-size: 80px;
}
.more {
  position: absolute;
  left: 0;
  color: blue;
  width: 100%;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
  font-family: cursive;
}
.divide-line{
  height: 10px;
  background: url('./static/line.png') no-repeat center center;
  background-size: 90%;
}
.button {
  height: 50rpx;
  font-size: 20rpx;
  line-height: 50rpx;
}

template {
  display: flex;
  flex: 1;
}

.search {
  flex-direction: column;
  width: 100%;

  &__picker__value,
  input,
  textarea {
    box-sizing: border-box;
    font-size: 20rpx;
    line-height: 1.5;
    color: #333;
    border: 1px solid #ccc;
    width: 100%;
    padding: 16rpx 24rpx;
    border-radius: 8rpx;
    height: 62rpx;

    &.disabled {
      background-color: #ddd;
    }
  }
  &__picker__value {
    white-space: nowrap;
    word-break: break-all;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		display: -webkit-box !important;
		-webkit-line-clamp: 1;//文字上限行
		-webkit-box-orient: vertical;
  }

  textarea {
    height: 200px;
  }

  .grid-c-06,
  .grid-c-12 {
    flex-direction: column;
    margin-bottom: 16rpx;
  }

  &__label {
    box-sizing: border-box;
    font-size: 20rpx;
    line-height: 1.5;
    color: #666;
    padding: 8rpx 16rpx;
    height: 46rpx;
    flex: 0 0 auto;

    .required {
      color: red;
    }
  }

  &__value {
    box-sizing: border-box;
    font-size: 22rpx;
    line-height: 1.5;
    color: #333;
    padding: 0 16rpx;
    height: 36rpx;
    flex: 0 0 auto;
    word-break: break-all;
  }
}

.search2 {
  width: 100%;
  flex-direction: column;
  padding: 16rpx;

  &__btn {
    flex-basis: 120rpx;
    width: 120rpx;
    height: 60rpx;

    button {
      height: 60rpx;
      font-size: 20rpx;
      line-height: 60rpx;
      width: 100%;
    }
  }

  &__input {
    flex: 1;

    .input {
      width: 100%;
      font-size: 20rpx;
      padding: 0 16rpx;
      border: 1px solid #ddd;
      border-radius: 8rpx;
      height: 60rpx;
    }
  }
}
picker[disabled] {
  background-color: #eee;
}
</style>
