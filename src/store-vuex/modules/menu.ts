const MENU = {
  state: {
    data: {
      label: '',
      value: ''
    }
  },
  mutations: {
    SET_MENU: (state: any, menu: object) => {
      state.data = menu;
    }
  },
  actions: {
    // setMenu(opt: any, a: any, b: any) {
    //   console.log('opt a b', opt, a, b);
    //   // commit('SET_MENU', data ? data : { unit: 'E豆', ratio: 100 })
    //   // commit('SET_MENU', 'aaa');
    // },

    setMenu(opt: any) {
      console.log('opt a b', opt);
      // commit('SET_MENU', data ? data : { unit: 'E豆', ratio: 100 })
      // commit('SET_MENU', 'aaa');
    }
  }
};

export default MENU;
