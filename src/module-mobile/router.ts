import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import ComApp from '@/components/ComApp.vue';

const routes: Array<RouteConfig> = [
  {
    path: 'categorylist',
    name: 'category',
    component: () =>
      import(
        /* webpackChunkName: "module-mobile" */ './pages/CategoryList.vue'
      ),
    meta: {
      title: '应用列表',
      navShow: true,
      tabShow: true,
      navLeftShow: false,
      navRightShow: true,
      type: 'aaa'
    }
  },
  {
    path: 'hotlist',
    name: 'hotlist',
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/HotList.vue'),
    meta: {
      title: '热点',
      navShow: true,
      tabShow: true,
      navLeftShow: false,
      navRightShow: true,
      type: 'bbb'
    }
  },
  {
    path: 'hotlist-ts',
    name: 'hotlist-ts',
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/HotListTs.vue'),
    meta: {
      title: '热点ts',
      navShow: true,
      tabShow: true,
      navLeftShow: false,
      navRightShow: true,
      type: 'bbb'
    }
  },
  {
    path: 'pyqlist',
    name: 'pyqlist',
    meta: {
      title: '朋友圈',
      navShow: true,
      tabShow: true,
      navLeftShow: false,
      navRightShow: true,
      type: 'bbb'
    },
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/PyqList.vue')
  },
  {
    path: 'mine',
    name: 'mine',
    meta: {
      title: '个人中心',
      navShow: true,
      tabShow: true,
      navLeftShow: false,
      navRightShow: true,
      type: 'bbb'
    },
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/Mine.vue')
  },
  {
    path: '',
    name: 'mobileDefault',
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/CategoryList.vue')
  }
];

export default {
  path: '/m',
  name: 'mobile',
  component: ComApp,
  children: routes
};
