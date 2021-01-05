// import '@babel/polyfill';
import { createSSRApp } from 'vue';
import { sync } from 'vuex-router-sync';

import App from '/@/App.vue';
import Iconfont from '/@/components/Iconfont.vue';
import { createMyStore } from '/@/store-vuex';
import { createMyRouter } from './createRouter';


// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key]);
// });

export function createApp() {
  const router = createMyRouter();
  const store = createMyStore();

  // 同步路由状态(route state)到 store
  sync(store, router);

  const app = createSSRApp(App);

  app.use(store)
    .use(router)
    .component(Iconfont.name, Iconfont);

  return {
    app,
    router,
    store
  };
}

export default createApp;
