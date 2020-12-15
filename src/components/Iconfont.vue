<template>
  <i :class="classObject" @click="onClick" />
</template>

<style lang="scss">
@import url('//at.alicdn.com/t/font_1211327_h4kaa5q2x3p.css');
</style>

<script>
export default {
  name: 'Iconfont',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      classObject: {
        iconfont: true,
        ['iconfont-ddj']: true,
        [this.type]: true
      }
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
</script>
