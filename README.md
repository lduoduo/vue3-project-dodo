# vue3-project-dodo

## vue3 + ts + jsx + koa2 + vite + webpack5 + dev-ssr + prd-ssr

## node >= 12.20.0 (for ECMAScript modules)
[https://nodejs.org/docs/latest-v12.x/api/esm.html](https://nodejs.org/docs/latest-v12.x/api/esm.html)

## Project setup
```
yarn install
```

### run development
```
yarn dev
```

### run development with ssr
```
yarn dev:ssr
```

### build for production
```
yarn build:v
```

### build for production with csr
```
yarn build:csr
```

### build for production with ssr
```
yarn build:ssr
```

### run production with ssr
```
yarn start:ssr
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### changes from sources
- add renderToStream in own local script [https://github.com/nuxt/vue-bundle-renderer](https://github.com/nuxt/vue-bundle-renderer)
- webpack-dev-middleware / webpck-hot-middleware: change code to work with koa

### debug webpack with vscode
- folder debug
- launch vscode debug

### 踩坑
1. [vite] Failed to resolve module import "@/components/HelloWorld.vue". (imported by /src/views/Home.vue)
2. [vue-devtools]: Vue.js not detected
  [https://github.com/vuejs/vue-devtools/issues/1279](https://github.com/vuejs/vue-devtools/issues/1279)
3. pre-commit: util.getSystemErrorName is not a function
4. The set-cookie was blocked because its domain attribute was invalid with regards to the current host url
 一般在域名前是需要加一个"."的，如"domain=.looli.com"。如果设置localhost的cookie，则不要设置domain,直接整个domain字段都不需要
5. Cannot read property '$createElement' of undefined
6. koa-static-cache报错：Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  - 自定义的中间件，执行下一个中间件，不能用next(), 一定要用await next()！，直接next(), 返回了一个空的Promise
7. renderToString 会提前中断
  - @vue/cli-service 引用的vue-loader有问题不对
8. CSR 预渲染报错 [prerender-spa-plugin] Unable to prerender all routes!
  [已提PR](https://github.com/chrisvfritz/prerender-spa-plugin/pull/415)
  - 现已直接代码移植到项目中进行修改
9. Alias in css don't work[issue here](https://github.com/vitejs/vite/issues/650)
10. vite jsx: ReferenceError: React is not defined: 加入插件：@vue/babel-plugin-jsx
11. 从 Vue 3.0 开始，过滤器已删除，不再支持

### v3学习
- [V3 组合式API 生命周期钩子](https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html)
### SEO优化：
1.SSR；
2.静态化；
3.预渲染prerender-spa-plugin；
4.使用Phantomjs针对爬虫做处理

### 参考资料
- [vite 完整配置](https://github.com/vitejs/vite/blob/master/src/node/config.ts)
- [vite + eslint + airbnb初体验, 配置eslint的alias](https://www.jianshu.com/p/f3f03fa9ab42)
- [Vue3 配置文件vite.config.js——请求代理、第三方模块引用、别名alias(五)](https://blog.csdn.net/hbiao68/article/details/108972775)
- [https://github.com/ozguruysal/vue3-ssr](https://github.com/ozguruysal/vue3-ssr)
- [https://github.com/raukaute/vue-hackernews-3.0](https://github.com/raukaute/vue-hackernews-3.0)
- [https://github.com/nuxt-contrib/bundle-runner](https://github.com/nuxt-contrib/bundle-runner)
- [https://github.com/nuxt/vue-bundle-renderer](https://github.com/nuxt/vue-bundle-renderer)