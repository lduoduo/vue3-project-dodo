import './public-path';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store-vuex';

// import "./registerServiceWorker";
// import './myQiankun';

import Iconfont from './components/Iconfont.vue';

import './app.css';

router.beforeEach((to, from, next) => {
  console.log('路由导航守卫to', to);
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

let app = null;

const render = (props = {}) => {
  const { container } = props;
  app = createApp(App)
    .use(store)
    .use(router)
    .component(Iconfont.name, Iconfont)
    .mount(container ? container.querySelector('#app') : '#app');

  console.log('app.config', app.config);

  // app.config.errorHandler = (err, vm, info) => {
  //   console.log('全局错误', err, vm, info);
  // };

  // app.config.warnHandler = (msg, vm, trace) => {
  //   // `trace` is the component hierarchy trace
  //   console.log('全局警告', msg, vm, trace);
  // };
};

if (typeof window !== undefined && !window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
}

export async function mount(props) {
  // storeTest(props);
  render(props);
  app.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
  app.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  app.unmount();
  app._container.innerHTML = '';
  app = null;
}
