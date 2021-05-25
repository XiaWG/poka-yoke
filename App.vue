<script>
import { checkVersion } from "@/api/remote.js";
import store from "./store/index";

export default {
  onLaunch() {
    
  },
  onShow: function () {
    console.log('onShow')
    store.commit('showKeyboard/SET_KEYBOARD_TIMER')
  },
  onHide: function () {
    console.log('onHide')
    store.commit('showKeyboard/SET_KEYBOARD_TIMER_CLEAR')
  },
};
</script>

<style lang="scss">
@import "./common/common.css";

@font-face {
  font-family: 'iconfont';
  src: url('@/static/font/iconfont.ttf?t=1621577781686') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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
