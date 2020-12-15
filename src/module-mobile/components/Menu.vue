<template>
  <div class="mobile-menu">
    <div
      v-for="item in list"
      :key="item.value"
      :class="['menu-item', item.path === currPath ? 'active' : '']"
      @click="onClick(item)"
    >
      <Iconfont class="item-icon" :type="item.icon" />
      <p>{{ item.label }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/mixin.scss';
.mobile-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.06), inset 0 0.5px 0 0 #ddd;

  .menu-item {
    padding: 6px 0;
    flex: none;
    width: 20%;
    text-align: center;
    font-size: 10px;
    p {
      margin: 0;
    }
    .item-icon {
      display: inline-block;
      font-size: 24px;
      margin-bottom: 4px;
      font-weight: bold;
    }

    &.active {
      color: $activeColor;
    }
  }
}
</style>

<script>
import { mapActions } from 'vuex';
import Iconfont from '@/components/Iconfont.vue';

export default {
  name: 'Menu',
  components: {
    Iconfont
    // [Iconfont.name]: Iconfont
  },
  data() {
    return {
      list: [
        {
          icon: 'icon-ddj-naozhong',
          value: 'category',
          label: '应用列表',
          path: '/m/categorylist'
        },
        {
          icon: 'icon-ddj-shezhi',
          value: 'rd',
          label: '热点',
          path: '/m/hotlist'
        },
        {
          icon: 'icon-ddj-shezhi',
          value: 'rdts',
          label: '热点ts',
          path: '/m/hotlist-ts'
        },
        {
          icon: 'icon-ddj-shouhuodizhi',
          value: 'pyq',
          label: '朋友圈',
          path: '/m/pyqlist'
        },
        {
          icon: 'icon-ddj-shouye',
          value: 'mine',
          label: '个人中心',
          path: '/m/mine'
        }
      ],
      currPath: this.$route.path
    };
  },
  beforeMount() {
    // console.log("this router", this.$route, this);
  },
  mounted() {
    // console.log('this.store', this.$store, this);
  },
  watch: {
    $route: 'onRouteChange'
  },
  methods: {
    ...mapActions(['setMenu']),
    onRouteChange(e, a) {
      console.log('onRouteChange', e, a);
    },
    onClick(e) {
      const { path } = e;
      if (path === this.$route.path) return;

      this.$router.push(path);
    }
  }
};
</script>
