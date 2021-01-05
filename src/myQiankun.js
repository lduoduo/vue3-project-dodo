import { registerMicroApps, start, runAfterFirstMounted } from 'qiankun';

import render from './qiankunRender';

/**
 * Step1 初始化应用（可选）
 */
render({ loading: true });

const loader = loading => render({ loading });

/**
 * Step2 注册子应用
 */
registerMicroApps(
  [
    // {
    //   name: 'vue2 app', // app name registered
    //   entry: '//localhost:10003',
    //   container: '#third',
    //   loader,
    //   activeRule: '/vue2'
    // },
    // {
    //   name: 'vue2-2 app',
    //   entry: {
    //     scripts: [
    //       '//localhost:10003/runtime.e580e93f2025f67efc5e.js',
    //       '//localhost:10003/vendor.427a1e2d4cfb765bba34.js',
    //       '//localhost:10003/main.b9cacaeb6ef2b61cb433.js'
    //     ]
    //   },
    //   container: '#third',
    //   activeRule: '/vue2-2'
    // },
    {
      name: 'vue2-2 app',
      entry: '//localhost:7105',
      container: '#third',
      loader,
      activeRule: '/ov2'
    },
    {
      name: 'vue3 app',
      entry: '//localhost:7106',
      container: '#third',
      loader,
      activeRule: '/ov3'
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      }
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      }
    ],
    afterUnmount: [
      app => {
        console.log(
          '[LifeCycle] after unmount %c%s',
          'color: green;',
          app.name
        );
      }
    ]
  }
);

start();

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});
