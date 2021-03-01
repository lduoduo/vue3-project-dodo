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
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
} from 'vue';
// 在这里导入模块，而不是在 `store/index.js` 中
import hotStoreModule from '/@/store-vuex/modules/hotList';

import Search from '../components/Search.vue';
import Menu from '../components/Menu.vue';
import CompItem from '../components/Hot/Item.vue';
import Layout from '/@/components/Layout.vue';

import { getHotList } from '/@/network/api';

export default defineComponent({
  name: 'HotListTS',
  components: { Search, Menu, CompItem, Layout },
  asyncData({ store, route }) {
    console.log('asyncData store', store);

    if (!store.hasModule('hotList')) {
      console.log('注册store hotList');
      store.registerModule('hotList', hotStoreModule);
    }

    // 触发 action 后，会返回 Promise
    return store.dispatch('hotList/fetchtHotList', { type: 1 });
  },
  setup() {
    const state = reactive({
      search: '',
      pageNo: 1,
      loading: false,
      finished: false,
      list: [],
    });

    const fetchtHotList = () => {
      getHotList().then((e) => {
        const { list = [], totalcount = 0 } = e;
        state.list = list;
      });
    };

    onMounted(() => {
      fetchtHotList();
    });

    onUnmounted(() => {
      console.log('hotlist 卸载');
    });

    const onSearch = (val) => {
      console.log('onSearch', val);
    };

    const onCancel = () => {
      console.log('onCancel');
    };

    return { ...toRefs(state), onSearch, onCancel };
  }
});
</script>
