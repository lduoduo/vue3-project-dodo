import VueRouter, { RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

import routeMobile from '../module-mobile/router';
import routePc from '../module-pc/router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'VUE首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login2" */ '../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  routeMobile,
  routePc
];

export default routes;
