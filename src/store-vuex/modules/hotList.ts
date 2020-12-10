import Vue from 'vue';

import { getHotList } from '@/network/api';

// store/modules/hotList.js
export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    totalcount: 0,
    list: []
  }),
  actions: {
    fetchtHotList($store: any, d: any) {
      const { commit, state } = $store;
      // `store.dispatch()` 会返回 Promise，
      // 以便我们能够知道数据在何时更新
      return getHotList().then(e => {
        const { totalcount = 0, list = [] } = e;
        commit('SET_HOTLIST', e);
      });
    }
  },
  mutations: {
    SET_HOTLIST: (state: any, data: any) => {
      const { totalcount = 0, list = [] } = data;
      // console.log('SET_HOTLIST', state, data);
      state.list = list;
      state.totalcount = totalcount;
    }
  }
};
