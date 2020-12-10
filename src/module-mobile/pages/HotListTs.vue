<template>
  <Layout class="page-hotlist">
    <template #header>
      <Search
        v-model="search"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </template>

    <template>
      <CompItem
        class="body-item"
        v-for="item in list"
        :key="item.id"
        :data="item"
      />
    </template>

    <template #footer>
      <Menu />
    </template>
  </Layout>
</template>

<style lang="scss">
.page-hotlist {
  .page-body {
    padding: 1%;
  }

  .body-item {
    background-color: #fff;
    width: 48%;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 16px;
    margin: 1%;
  }
}
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import Loading from '@/components/Loading.vue';

import Layout from '@/components/Layout.vue';

import Search from '../components/Search.vue';
import Menu from '../components/Menu.vue';
import CompItem from '../components/HotTs/Item.vue';

import { getHotList } from '@/network/api';

@Component({
  name: 'PageHotListTs',
  components: {
    Layout,
    Search,
    Menu,
    CompItem
  }
})
export default class App extends Vue {
  private search = '';
  private list = [];
  private loading = false;
  private pageNo = 1;
  private pageSize = 10;

  beforeMount() {
    this.fetchtHotList();
  }

  private onSearch(val: string) {
    console.log('onSearch', val);
  }

  private onCancel() {
    console.log('onCancel');
  }

  private fetchtHotList() {
    getHotList().then(e => {
      const { list = [], totalcount = 0 } = e;
      this.list = list;
    });
  }
}
</script>
