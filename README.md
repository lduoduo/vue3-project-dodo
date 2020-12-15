# vue-project
## vue3 + vite + webpack5

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
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

### 踩坑
1. [vite] Failed to resolve module import "@/components/HelloWorld.vue". (imported by /src/views/Home.vue)
2. [vue-devtools]: Vue.js not detected
  [https://github.com/vuejs/vue-devtools/issues/1279](https://github.com/vuejs/vue-devtools/issues/1279)
3. pre-commit: util.getSystemErrorName is not a function
4. The set-cookie was blocked because its domain attribute was invalid with regards to the current host url
 一般在域名前是需要加一个"."的，如"domain=.looli.com"。如果设置localhost的cookie，则不要设置domain,直接整个domain字段都不需要

### 参考资料
- [vite 完整配置](https://github.com/vitejs/vite/blob/master/src/node/config.ts)
- [vite + eslint + airbnb初体验, 配置eslint的alias](https://www.jianshu.com/p/f3f03fa9ab42)
- [Vue3 配置文件vite.config.js——请求代理、第三方模块引用、别名alias(五)](https://blog.csdn.net/hbiao68/article/details/108972775)