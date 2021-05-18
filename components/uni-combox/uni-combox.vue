<template>
  <view class="uni-combox">
    <view v-if="label" class="uni-combox__label" :style="labelStyle">
      <text>{{ label }}</text>
    </view>
    <view class="uni-combox__input-box">
      <input
        class="uni-combox__input"
        type="text"
        :placeholder="placeholder"
        v-model="inputVal"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        :disabled="disabled"
      />
      <uni-icons
        class="uni-combox__input-arrow"
        type="arrowdown"
        size="14"
        @click="toggleSelector"
      ></uni-icons>
      <view class="uni-combox__selector" v-if="showSelector">
        <scroll-view scroll-y="true" class="uni-combox__selector-scroll">
          <view
            class="uni-combox__selector-empty"
            v-if="filterCandidatesLength === 0"
          >
            <text>{{ emptyTips }}</text>
          </view>
          <view
            class="uni-combox__selector-item"
            v-for="(item, index) in filterCandidates"
            :key="index"
            @click="onSelectorClick(index)"
          >
            <text>{{ item }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from "../uni-icons/uni-icons.vue";
export default {
  name: "uniCombox",
  components: {
    uniIcons,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: String,
      default: "auto",
    },
    placeholder: {
      type: String,
      default: "",
    },
    candidates: {
      type: Array,
      default() {
        return [];
      },
    },
    emptyTips: {
      type: String,
      default: "无匹配项",
    },
    value: {
      type: String,
      default: "",
    },
    inputChange: {
      type: Boolean,
      default: false,
    },
    upperCase: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSelector: false,
      inputVal: "",
    };
  },
  computed: {
    labelStyle() {
      if (this.labelWidth === "auto") {
        return {};
      }
      return {
        width: this.labelWidth,
      };
    },
    filterCandidates() {
      return this.candidates.filter((item) => {
        if (this.upperCase) {
          return this.inputVal && item
            ? item.toUpperCase().indexOf(this.inputVal.toUpperCase()) > -1
            : true;
        }
        return item.indexOf(this.inputVal) > -1;
      });
    },
    filterCandidatesLength() {
      return this.filterCandidates.length;
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.inputVal = newVal;
      },
      immediate: true,
    },
  },
  methods: {
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    onFocus() {
      this.showSelector = true;
    },
    onBlur() {
      setTimeout(() => {
        this.showSelector = false;
      }, 500);
    },
    onSelectorClick(index) {
      this.inputVal = this.filterCandidates[index];
      this.$emit("input", this.inputVal);
      this.showSelector = false;
    },
    onInput() {
      if (this.inputChange) {
        setTimeout(() => {
          this.$emit("input", this.inputVal);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.uni-combox {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  height: 60rpx;
  flex-direction: row;
  align-items: center;
  // border-bottom: solid 1px #DDDDDD;
}

.uni-combox__label {
  font-size: 30rpx;
  line-height: 60rpx;
  padding-right: 10px;
  color: #999999;
}

.uni-combox__input-box {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
  align-items: center;
}

.uni-combox__input {
  flex: 1;
  font-size: 22rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding-left: 16rpx;
}

.uni-combox__input-arrow {
  padding: 10px;
  position: absolute;
  right: 0;
}

.uni-combox__selector {
  box-sizing: border-box;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: #dddddd 4px 4px 8px, #dddddd -4px -4px 8px;
  z-index: 2;
}

.uni-combox__selector-scroll {
  max-height: 400px;
  box-sizing: border-box;
}

.uni-combox__selector::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: solid 6px #ffffff;
  border-right: solid 6px transparent;
  border-left: solid 6px transparent;
  left: 50%;
  top: -6px;
  margin-left: -6px;
}

.uni-combox__selector-empty,
.uni-combox__selector-item {
  /* #ifdef APP-NVUE */
  display: flex;
  /* #endif */
  line-height: 50rpx;
  font-size: 22rpx;
  text-align: center;
  border-bottom: solid 1px #dddddd;
  margin: 0px 10px;
}

.uni-combox__selector-empty:last-child,
.uni-combox__selector-item:last-child {
  border-bottom: none;
}
</style>
