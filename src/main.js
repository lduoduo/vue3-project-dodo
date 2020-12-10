import { createApp } from 'vue';
import App from './App.vue';
// import "./registerServiceWorker";
import router from './router';
import store from './store-vuex';

router.beforeEach((to, from, next) => {
  console.log('路由导航守卫to', to);
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
