import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store-vuex-ts';

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

interface IdataGoods {
  goodsName: string;
  goodsId: string;
}

export interface IstateGoods {
  data: IdataGoods;
}

// @Module 标记当前为module
// module本身有几种可以配置的属性
// 1、namespaced:boolean 启/停用 分模块
// 2、stateFactory:boolean 状态工厂
// 3、dynamic:boolean 在store创建之后，再添加到store中。 开启dynamic之后必须提供下面的属性
// 4、name:string 指定模块名称
// 5、store:Vuex.Store实体 提供初始的store
@Module({ dynamic: true, store, name: 'goods' })
class App extends VuexModule implements IstateGoods {
  public data = {
    goodsName: '',
    goodsId: ''
  };

  @Mutation
  private SET_GOODS(data: IdataGoods) {
    this.data = data;
  }

  @Action
  public setGoods(d: any) {
    return fetchData(d).then(e => {
      this.SET_GOODS(d);
    });
  }

  @Action
  public asSetGoods(d: any) {
    this.setGoods(d);
  }

  @Action
  public async actionA(d: any) {
    const tmp = await fetchData(d);
    this.SET_GOODS(d);
  }

  @Action
  public async actionB(d: any) {
    await this.actionA(d);
  }

  get currGoods() {
    return this.data;
  }
}

export const GoodsModule = getModule(App);
