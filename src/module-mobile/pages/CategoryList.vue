<template>
  <div class="page page-categorylist">
    <Search
      v-model="search"
      show-action
      :list="idList"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <div class="page-body">
      <CompItem
        class="body-item"
        v-for="item in list"
        :key="item.title"
        :data="item"
      />
    </div>
    <Menu />
  </div>
</template>

<style lang="scss">
.page-categorylist {
  .page-body {
    flex: 1;
    overflow: auto;
    background-color: #f5f5f9;
  }

  .body-item {
    background-color: #fff;
    & + .body-item {
      margin-top: 12px;
    }
  }
}
</style>
<script>
import Menu from '../components/Menu.vue';
import Search from '../components/Search.vue';
import CompItem from '../components/Category/Item.vue';

import { getCategoryList, getCategoryIdList } from '@/network/api';

console.log('category');

export default {
  name: 'CategoryList',
  components: {
    Search,
    Menu,
    CompItem
  },
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('fetchtHotList');
  },
  data() {
    return {
      search: '',
      pageNo: 1,
      loading: false,
      finished: false,
      idList: [],
      list: []
    };
  },
  beforeMount() {
    this.fetchCategoryList();
    this.fetchCategoryIdList();
  },
  methods: {
    onSearch(d) {
      console.log('onSearch', d);
      this.fetchCategoryList(d);
    },
    onCancel() {
      console.log('onCancel');
    },
    fetchCategoryList(param) {
      getCategoryList(param).then(e => {
        const arr = Object.keys(e).map(k => {
          return {
            title: k,
            count: e[k].length,
            list: e[k]
          };
        });

        console.log('arr', arr);
        this.list = arr;
      });
    },
    fetchCategoryIdList() {
      getCategoryIdList().then(e => (this.idList = e));
    }
  }
};
</script>
