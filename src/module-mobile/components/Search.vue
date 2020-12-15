<template>
  <div class="mobile-search">
    <div v-if="!showSearch && arr && arr.length > 0" class="search-list">
      <div
        :class="['list-item', item.value === currItem.value ? 'active' : '']"
        v-for="item in arr"
        :key="item.id"
        @click="onClickItem(item)"
      >
        <span>{{ item.label || '未知' }}</span>
        <span v-if="item.count">({{ item.count }})</span>
      </div>
    </div>
    <Iconfont
      v-if="!showSearch && arr && arr.length > 0"
      type="icon-ddj-sousuo"
      class="icon-search btn"
      @click="onToggle(true)"
    />
    <VSearch
      class="search-input"
      v-model="search"
      show-action
      v-if="showSearch"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onToggle(false)"
    />
  </div>
</template>

<style lang="scss">
.mobile-search {
  height: 52px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100vw;
  padding-left: 15px;
  overflow: hidden;
  box-shadow: inset 0 -1px 0 0 #e5e5e5;
  box-sizing: border-box;

  .search-list {
    white-space: nowrap;
    overflow: auto;
    font-size: 12px;
  }

  .list-item {
    padding: 5px 8px;
    margin: 4px;
    border-radius: 4px;
    background-color: #f4f4f4;
    display: inline-block;
    border: 0.5px solid transparent;
    &.active {
      border-radius: 4px;
      background-color: #e9f4ff;
      border-color: #c1e0ff;
      color: #0080fe;
    }
  }

  .icon-search {
    flex: none;
    padding: 16px 17px;

    &.btn {
      box-shadow: -1px 0 10px #ddd;
      z-index: 1;
    }
  }

  .van-search {
    padding: 0;
    flex: 1;
    .van-search__action {
      padding: 0 12px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>

<script>
import { Search as VSearch } from 'vant';
import Iconfont from '@/components/Iconfont.vue';

export default {
  name: 'Search',
  components: {
    Iconfont,
    VSearch
  },
  props: {
    list: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => []
    }
  },
  data() {
    return {
      search: '',
      searchAble: false,
      currItem: {
        value: '',
        label: ''
      }
    };
  },
  computed: {
    showSearch() {
      return this.searchAble || this.list.length === 0;
    },
    arr() {
      const { list = [] } = this;
      return list.length > 0 ? [{ value: '', label: '全部' }, ...list] : [];
    }
  },
  beforeMount() {
    // console.log('this router', this.$route, this);
  },
  watch: {
    $route: 'onRouteChange'
  },
  methods: {
    onRouteChange(e) {
      console.log('onRouteChange', e, this.$route);
    },
    onSearch(val) {
      console.log('onSearch', val);
      this.$emit('search', { search: val });
    },
    onCancel() {
      console.log('onCancel');
    },
    onToggle(e) {
      this.searchAble = !!e;
    },
    onClickItem(e) {
      this.currItem = e;
      this.$emit('search', { id: e.value });
    }
  }
};
</script>
