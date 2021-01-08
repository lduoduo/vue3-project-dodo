<template>
  <div class="login">
    <Field v-model="loginName" type="text" label="用户名1" />
    <Field v-model="password" type="password" label="密码" />

    <Button
      type="primary"
      loading-text="加载中..."
      :loading="loading"
      :disabled="!loginName || !password"
      @click="onLogin"
      >登录</Button
    >
  </div>
</template>
<script lang="ts">
import { reactive, defineComponent, toRefs, onMounted } from 'vue';
import { Button, Field } from 'vant';

import { get, post } from '/@/network/fetch';
import asyncLoad from '/@/utils/asyncLoad';

import { EncrptKey } from '/@/config/index';

const doLogin = (e: { loginName: string; encryptPasswd: string }) => {
  const { loginName, encryptPasswd } = e;

  const param = {
    loginName,
    encryptPasswd,
    source: 'H5'
  };

  return post({
    server: 'temp',
    path: '/api/customer/v3/loginPage/loginV3',
    data: param
  }).then((d: { code: any; result?: {} | undefined; message: any }) => {
    const { code, result = {}, message: msg } = d;
    if (+code) return Promise.reject(msg);
    return Promise.resolve(result);
  });
};

export default defineComponent({
  components: {
    Button,
    Field
  },
  setup() {
    const state = reactive({
      loginName: '',
      password: '',
      loading: false
    });

    const loginRef = {
      crypt: undefined
    };

    const onLogin = () => {
      console.log('onLogin', state);
      state.loading = true;

      doLogin({
        loginName: state.loginName,
        encryptPasswd: loginRef.crypt.encrypt(state.password)
      });
    };

    onMounted(() =>
      asyncLoad('/lib/jsencrypt.min.js').then(() => {
        if (!window.JSEncrypt) return;
        loginRef.crypt = new window.JSEncrypt();
        loginRef.crypt.setKey(EncrptKey);
      })
    );
    return {
      ...toRefs(state),
      onLogin
    };
  }
});
</script>
