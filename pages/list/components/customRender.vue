<template>
  <m-td :options="options" :model="model" />
</template>

<script>
export default {
  name: 'customRender',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    model: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    mTd: {
      name: 'mTd',
      props: {
        options: {
          type: Object,
          default: () => ({})
        },
        model: {
          type: Object,
          default: () => ({})
        }
      },
      render: function (createElement) {
        return this.options.render(createElement, this.model)
      }
    }
  }
}
</script>
