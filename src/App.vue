<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/p">pc</router-link> |
    <router-link to="/p/fragment">fragment</router-link> |
    <router-link to="/p/suspense">suspense</router-link> |
    <router-link to="/p/teleport">teleport</router-link> |
    <router-link to="/p/aliplay">aliplay</router-link> |
    <router-link to="/m/annual-bill-2020">20账单</router-link> |
    <router-link to="/ov2">ov2</router-link> |
    <router-link to="/ov3">ov3</router-link> |
    <router-link to="/vue2">我的v2</router-link> |
    <router-link to="/login">login</router-link> |
    <router-link to="/m/dd">计时器</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#nav {
  padding: 12px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
