import Vue from 'vue';
import { createStore } from 'vuex';
import axios from 'axios';

import ENV from '@/config/env/index';

import { IstateGoods } from './modules/goods';
import { IStateUser } from './modules/user';
import { IstateHotList } from './modules/hotList';

const baseURL = ENV.API.local;

// Vuex.Store.prototype.$request = axios.create({
//   baseURL: baseURL,
//   timeout: 1000
// });

// Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export interface IstateRoot {
  goods: IstateGoods;
  user: IStateUser;
  hotList: IstateHotList;
}

// Declare empty store first, dynamically register all modules later.
export function createMyStore() {
  return createStore({
    strict: debug
  });
}

export default createMyStore();
