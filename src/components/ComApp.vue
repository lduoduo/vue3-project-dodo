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
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const setTitle = (e) => {
      if (typeof document === undefined) return;

      if (document.title === e) return;
      document.title = e;
    };

    const pushWithQuery = (query) => {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      });
    };

    onBeforeMount(() => {
      console.log('onBeforeMount props', props);
      // const { title = '' } = this.$route.meta || {};
      // setTitle(title);
      console.log('this router', route);
    });
  },
});
</script>
