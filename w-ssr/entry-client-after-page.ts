/*
 * @Author: lduoduo
 * @Date: 2020-11-28 21:10:17
 * @Last Modified by: lduoduo
 * @Last Modified time: 2020-11-28 21:11:05
 * 切换路由时，数据预取发生在切换路由后，进入渲染具体路由组件时
 */
import createApp from './createApp';

// 客户端特定引导逻辑……

const { app, router, store } = createApp();

// 这里假定 App.vue 模板中根元素具有 `id="app"`

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app');
});
