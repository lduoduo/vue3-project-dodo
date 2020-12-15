<template>
  <div class="page page-mine">
    <Search
      v-model="search"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <Loading />
    <Menu />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

import Search from '../components/Search.vue';
import Menu from '../components/Menu.vue';

export default {
  name: 'HotList',
  components: {
    Search,
    Menu,
    Loading
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
  mounted() {
    //
  },
  methods: {
    onSearch(val) {
      console.log('onSearch', val);
      console.warn('警告!');
      setTimeout(function() {
        console.log('dodo', this.dodo());
      }, 3000);
    },
    onCancel() {
      console.log('onCancel');
    }
  }
};
</script>
