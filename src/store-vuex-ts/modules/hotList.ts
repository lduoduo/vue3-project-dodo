import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store-vuex-ts';

import { getHotList } from '@/network/api';

const fetchData = (d: any) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(d);
    }, 1000);
  });

export enum DeviceType { // 定义设备枚举类型
  Mobile,
  Desktop
}

export interface IstateHotList {
  data: {
    list: Array<object>;
  };
}

// @Module 标记当前为module
// module本身有几种可以配置的属性
// 1、namespaced:boolean 启/停用 分模块
// 2、stateFactory:boolean 状态工厂
// 3、dynamic:boolean 在store创建之后，再添加到store中。 开启dynamic之后必须提供下面的属性
// 4、name:string 指定模块名称
// 5、store:Vuex.Store实体 提供初始的store
@Module({ dynamic: true, store, name: 'hotList' })
class App extends VuexModule implements IstateHotList {
  public data = {
    list: []
  };

  @Mutation
  private SET_HOTLIST(data: object) {
    this.data = data;
  }

  @Action
  public setHotList(d: any) {
    return fetchData(d).then(e => {
      this.SET_HOTLIST(d);
    });
  }

  @Action
  public asSetHostList(d: any) {
    this.setHotList(d);
  }

  @Action
  public async actionA(d: any) {
    const tmp = await fetchData(d);
    this.SET_HOTLIST(d);
  }

  @Action
  public fetchtHotList(d: any) {
    // `store.dispatch()` 会返回 Promise，
    // 以便我们能够知道数据在何时更新
    return getHotList().then(e => {
      this.SET_HOTLIST(e);
    });
  }

  get currHostList() {
    return this.data;
  }
}

export const HostListModule = getModule(App);
