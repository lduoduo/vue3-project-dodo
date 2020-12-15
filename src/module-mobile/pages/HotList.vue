<template>
  <div class="page page-hotlist">
    <Search
      v-model="search"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <div class="page-body">
      <CompItem
        class="body-item"
        v-for="item in hotList"
        :key="item.id"
        :data="item"
      />
    </div>
    <Menu />
  </div>
</template>
<style lang="scss">
.page-hotlist {
  .page-body {
    flex: 1;
    padding: 1%;
    overflow: auto;
    background-color: #f5f5f9;
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
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
// 在这里导入模块，而不是在 `store/index.js` 中
import hotStoreModule from '@/store-vuex/modules/hotList';

import Search from '../components/Search.vue';
import Menu from '../components/Menu.vue';
import CompItem from '../components/Hot/Item.vue';

import { getHotList } from '@/network/api';

export default {
  name: 'HotList',
  components: {
    Search,
    Menu,
    CompItem
  },
  asyncData({ store, route }) {
    console.log('asyncData store', store);

    if (!store.hasModule('hotList')) {
      console.log('注册store');
      store.registerModule('hotList', hotStoreModule);
    }

    // 触发 action 后，会返回 Promise
    return store.dispatch('hotList/fetchtHotList', { type: 1 });
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    // this.$store.unregisterModule('hotList');
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
  beforeCreate() {
    // console.log()
  },
  beforeMount() {
    console.log('this.$store', this.$store);
    console.log('this.hotList', this.hotList);
    if (!this.hotList || this.hotList.length === 0) this.fetchtHotList();
  },
  computed: {
    hotList() {
      return this.$store.state?.hotList?.list || [];
    }
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
    }
  }
};
</script>
