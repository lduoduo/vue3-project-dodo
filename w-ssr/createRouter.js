import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from '@/router/routes';

Vue.use(VueRouter);

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    fallback: false,
    // scrollBehavior: () => ({ y: 0 }),
    routes
  });
}
