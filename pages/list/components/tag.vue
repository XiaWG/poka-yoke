<template>
  <view 
    :class="['tag', type]"
    :style="style"
  >
    {{text}}
  </view>
</template>

<script>
export default {
  name: 'comTag',
  props: {
    text: String,
    options: {
      type: Object,
      default: () => ({})
    },
    model: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    type () {
      return this.options.tagType || ''
    }
  },
  data () {
    return {
      style: {}
    }
  },
  created () {
    // this.getStyle()
  },
  watch: {
    model: {
      handler () {
        this.getStyle()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getStyle () {
      if (this.options.style && typeof(this.options.style) === 'function') {
        this.style = this.options.style(this.model)
      } else {
        this.style = this.options.style
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .tag{
    padding: 6rpx 16rpx;
    border-radius: 10rpx;
  }
  .warning{
    background: #ff9900;
    color: #fff;
  }
  .info{
    background: #2db7f5;
    color: #fff;
  }
  .success{
    background: #19be6b;
    color: #fff;
  }
  .error{
    background: #ed4014;
    color: #fff;
  }
</style>
