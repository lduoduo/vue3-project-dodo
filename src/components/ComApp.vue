<template>
  <div class="mobile">
    <router-view />
  </div>
</template>

<style lang="scss">
.mobile .page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
</style>

<script>
export default {
  name: 'CompApp',
  beforeMount() {
    const { title = '' } = this.$route.meta || {};
    this.setTitle(title);

    console.log('this router', this.$route, this);
  },
  watch: {
    $route: 'onRouteChange'
  },
  methods: {
    onRouteChange(e) {
      const { title = '' } = e.meta || {};
      console.log('onRouteChange', e, this.$route);
      this.setTitle(title);
    },
    setTitle(e) {
      if (typeof document === undefined) return;

      if (document.title === e) return;
      document.title = e;
    }
  }
};
</script>
