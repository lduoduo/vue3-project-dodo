import {
  createRouter,
  createWebHistory,
  createMemoryHistory
} from 'vue-router';

import { baseUrl } from '/@/config/index';

import routes from './routes';

const pathUrl =
  typeof window !== undefined && window.__POWERED_BY_QIANKUN__
    ? baseUrl
    : process.env.BASE_URL || '/';

const history = process.server
  ? createMemoryHistory()
  : createWebHistory(pathUrl);

const router = createRouter({
  history,
  routes
});

export function createMyRouter() {
  return createRouter({
    history,
    routes
  });
}

export default router;
