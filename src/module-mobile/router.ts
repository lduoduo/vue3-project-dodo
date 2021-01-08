import Vue from 'vue';
import VueRouter, { RouteRecordRaw } from 'vue-router';

import ComApp from '/@/components/ComApp.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: 'annual-bill-2020',
    name: 'annual-bill-2020',
    component: () =>
      import(
        /* webpackChunkName: "module-mobile" */ './pages/AnnualBill2020.jsx'
      ),
    meta: {
      title: '2020年度账单'
    }
  },
  {
    path: 'dd',
    name: 'dd',
    component: () =>
      import(/* webpackChunkName: "module-mobile" */ './pages/dd.jsx'),
    meta: {
      title: 'dd'
    }
  }
];

export default {
  path: '/m',
  name: 'mobile',
  component: ComApp,
  children: routes
};
