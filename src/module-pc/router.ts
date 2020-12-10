import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import ComApp from '/@/components/ComApp.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: 'fragment',
    name: 'Fragment',
    component: () => import('./pages/Fragment.vue')
  },
  {
    path: 'suspense',
    name: 'Suspense',
    component: () => import('./pages/Suspense.vue')
  },
  {
    path: 'teleport',
    name: 'Teleport',
    component: () => import('./pages/Teleport.vue')
  },
  {
    path: '',
    name: 'pcdefault',
    component: () => import('./pages/Suspense.vue')
  }
];

export default {
  path: '/p',
  name: 'pc',
  component: ComApp,
  children: routes
};
