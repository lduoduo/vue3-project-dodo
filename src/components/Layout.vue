<template>
  <div class="page page-layout">
    <header class="page-head">
      <!-- 我们希望把页头放这里 -->
      <slot name="header"></slot>
    </header>
    <main class="page-body">
      <!-- 我们希望把主要内容放这里 -->
      <slot></slot>
    </main>
    <footer class="page-foot">
      <!-- 我们希望把页脚放这里 -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Layout extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.page-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;

  .page-body {
    flex: 1;
    overflow: auto;
  }
}
</style>
