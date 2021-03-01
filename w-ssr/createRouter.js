import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router';

import routes from '/@/router/routes';

const history = process.browser ? createWebHistory() : createMemoryHistory();

// console.log('process.browser', process.browser);

export function createMyRouter() {
  return createRouter({
    history,
    routes
  });
}
