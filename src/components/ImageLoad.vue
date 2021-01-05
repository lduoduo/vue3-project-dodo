<template>
  <div
    class="component-image-load"
    :style="styleObj"
    @click.stop.prevent="onImageClick"
  >
    <Iconfont
      v-if="!loading && !loadedUrl"
      type="icon-ddj-sousuo"
      class="icon-img"
    />
    <Loading type="spinner" class="icon-loading" v-if="loading" />
    <slot />
  </div>
</template>

<style lang="scss">
.component-image-load {
  position: relative;
  background-color: #fafafa;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  .icon-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<script>
import { Loading } from 'vant';

export default {
  name: 'CompApp',
  components: {
    Loading
  },
  props: {
    url: {
      type: String
    }
  },
  data() {
    return { loading: true, loadedUrl: '', styleObj: {} };
  },
  beforeMount() {
    const img = new Image();

    img.onload = () => {
      this.loadedUrl = this.url;
      this.loading = false;
      this.styleObj = { backgroundImage: `url(${this.url})` };
    };

    img.src = this.url;
  },
  methods: {
    onImageClick() {
      this.$emit('click', this.url);
    }
  }
};
</script>
