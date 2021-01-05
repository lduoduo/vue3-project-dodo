const fetchData = (d: any) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(d);
    }, 1000);
  });

// 命名空间 namespaced: true

const GOODS = {
  // ZH: 仓库
  state: {
    data: {
      goodsName: '',
      goodsId: ''
    }
  },
  // 提交事务（同步），改变仓库的状态值，异步无法追踪值的变化
  mutations: {
    SET_GOODS: (state: any, data: object) => {
      console.log('SET_GOODS', state, data);
      state.data = data;
    }
  },
  // 提交mutations, 可以加入异步操作
  actions: {
    setGoods($store: any, d: any) {
      const { commit, state } = $store;
      console.log('actions setGoods', d, $store);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('SET_GOODS', d);
          resolve();
        }, 300);
      });
    },
    asSetGoods($store: any, d: any) {
      const { commit, dispatch } = $store;
      return dispatch('setGoods', d);
    },
    async actionA($store: any, d: any) {
      const { commit, state } = $store;
      const tmp = await fetchData(d);
      console.log('tmp', d, tmp, $store);

      commit('SET_GOODS', d);
    },
    async actionB($store: any, d: any) {
      const { commit, dispatch } = $store;
      await dispatch('actionA', d); // 等待 actionA 完成
      // commit('SET_GOODS', d);
    }
  },
  getters: {
    currGoods: (state: any) => state.data
  }
};

export default GOODS;
