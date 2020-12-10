// import '@babel/polyfill';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from '@/App.vue';

// import { createStore } from './store-demo';
import { createStore } from '@/store-vuex-ts';
import { createRouter } from './createRouter';

// import titleMixin from './utils/title';
// import * as filters from './filters/filters';

// Vue.prototype.$request = axios.create({
//   baseURL: 'http://' + conf.app.devHost + ':' + conf.app.port,
//   timeout: 1000
// })

Vue.prototype.$isProd = process.env.NODE_ENV === 'production';

// Vue.mixin(titleMixin);

// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key]);
// });

export function createApp() {
  const router = createRouter();
  const store = createStore();

  // 同步路由状态(route state)到 store
  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return {
    app,
    router,
    store
  };
}

export default createApp;
