<template>
  <Layout class="page page-pyqlist">
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
        @hook:mounted="onCompMounted"
        @hook:beforeUpdated="onCompBeforeUpdated"
        @hook:updated="onCompUpdated"
      />
    </template>

    <template #footer>
      <Menu />
    </template>
  </Layout>
</template>
<style lang="scss">
.page-pyqlist {
  .page-body {
    .body-item {
      background-color: #fff;
      vertical-align: top;
      & + .body-item {
        margin-top: 12px;
      }
    }
  }
}
</style>
<script>
import Layout from '@/components/Layout.vue';

import Search from '../components/Search.vue';
import Menu from '../components/Menu.vue';
import CompItem from '../components/Pyq/Item.vue';

import { getHotList } from '@/network/api';

export default {
  name: 'PyqList',
  components: {
    Search,
    Menu,
    CompItem,
    Layout
  },
  data() {
    return {
      search: '',
      pageNo: 1,
      loading: false,
      finished: false,
      list: []
    };
  },
  // beforeCreate() {

  // },
  beforeMount() {
    this.fetchtHotList();
  },
  methods: {
    onSearch(val) {
      console.log('onSearch', val);
    },
    onCancel() {
      console.log('onCancel');
    },
    fetchtHotList() {
      getHotList().then(e => {
        const { list = [], totalcount = 0 } = e;
        this.list = list;
      });
    },
    onCompMounted(e) {
      console.log('onCompMounted', e);
    },
    onCompBeforeUpdated(e) {
      console.log('onCompBeforeUpdated', e);
    },
    onCompUpdated(e) {
      console.log('onCompUpdated', e);
    }
  }
};
</script>
