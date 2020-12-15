/*
 * @Author: lduoduo
 * @Date: 2020-11-28 21:09:29
 * @Last Modified by: duoduo
 * @Last Modified time: 2020-11-30 17:11:29
 * 切换路由时，数据预取发生在切换路由时，进入匹配路由之前
 */
import { Toast } from 'vant';
import createApp from './createApp';

// 客户端特定引导逻辑……

const { app, router, store } = createApp();

// 这里假定 App.vue 模板中根元素具有 `id="app"`

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }

    // 这里如果有加载指示器 (loading indicator)，就触发
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    });

    Promise.all(
      activated.map(c => {
        if (c?.asyncData) {
          return c.asyncData({ store, route: to });
        }
      })
    )
      .then(() => {
        // 停止加载指示器(loading indicator)
        Toast.clear();

        console.log('停止loading');
        next();
      })
      .catch(next);
  });

  // app.$mount('#app');

  // 强制使用应用程序的激活模式
  app.$mount('#app', true);
});
