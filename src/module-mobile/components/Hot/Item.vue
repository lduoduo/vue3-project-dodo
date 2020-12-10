<template>
  <div
    :class="[
      'comp-hot-item',
      activeGoods && activeGoods.goodsId === data.goodsId ? 'active' : ''
      // activeGoodsId === data.goodsId ? 'active' : '',
    ]"
    @click="onDetailClick"
  >
    <!-- <p>{{ JSON.stringify(activeGoods) }}</p> -->
    <ImageLoad
      class="item-image"
      :url="data.goodsThumbnailUrl"
      style="{ backgroundImage1: `url(${data.goodsThumbnailUrl})` }"
    >
      <span :class="['item-tip', vip ? 'vip' : '']">{{ data.mallName }}</span>
    </ImageLoad>
    <div class="item-body">
      <div class="item-title">{{ data.goodsName }}</div>
      <div class="item-price flex">
        <div>
          <span class="item-price-buy-tip">{{
            `${data.couponDiscount ? '券后价' : ''}￥`
          }}</span>
          <span class="item-price-buy">{{ data.discountMinPrice }}</span>
        </div>
        <div class="flex discount" v-if="data.couponDiscount > 0">
          <span class="item-discount-tip">券</span>
          <span class="item-discount-price">{{
            data.couponDiscount + '元'
          }}</span>
        </div>
      </div>
      <div class="item-option flex">
        <p class="item-tip">{{ `销量${data.salesTip}件` }}</p>
        <p class="item-share">
          <span class="item-share-tip">分享赚￥</span>
          <span class="item-share-price">{{
            data.vipPromotionPrice | formatPrice
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/mixin.scss';

.comp-hot-item {
  box-shadow: $boxShadow;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;

  &.active {
    border: 2px dashed pink;
  }

  p {
    margin: 0;
  }

  .item-image {
    padding-bottom: 100%;
    position: relative;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    .item-tip {
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #757575;
      color: #fff;
      padding: 2px 6px;
      font-size: 12px;
      &.vip {
        background-color: rgba(139, 87, 42, 1);
      }
    }
  }

  .item-body {
    padding: 8px;

    .item-title {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-price {
      font-size: 10px;
      margin: 8px 0;

      &-buy,
      &-buy-tip {
        color: $colorRed;
      }

      &-buy {
        font-size: 12px;
        font-weight: bold;
      }

      .discount {
        background-color: $activeColor;
        border-radius: 2px;
      }

      .item-discount-price,
      .item-discount-tip {
        position: relative;
        color: white;
      }

      .item-discount-tip {
        padding: 0 3px;
      }

      .item-discount-price {
        padding: 0 4px;

        &:after {
          content: '...';
          display: inline-block;
          color: white;
          position: absolute;
          left: -1px;
          transform: rotate(90deg);
        }
      }
    }

    .item-option {
      .item-tip {
        font-size: 11px;
        color: $tipColor;
      }

      .item-share {
        font-size: 13px;
        font-weight: bold;
        color: white;
        background-color: $mainColor;
        padding: 4px 6px;
        padding-right: 6px;
        border-radius: 3px;
        box-sizing: border-box;
        width: 60%;
        text-align: center;

        .item-share-tip {
          font-size: 11px;
        }
      }
    }
  }
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ImageLoad from '@/components/ImageLoad.vue';
import { format$Floor, formatFloor } from '@/utils/price';

export default {
  name: 'CategoryItem',
  components: {
    ImageLoad
  },
  props: {
    data: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      vip: /(5|3)/.test(this.data.merchantType)
    };
  },
  computed: {
    activeGoodsId() {
      // console.log("this.$store", this.$store);
      // return this.$store.getters.currGoods.goodsId;
      return this.$store.getters?.currGoods?.goodsId;
    },
    ...mapGetters({
      // 把 `this.activeGoods` 映射为 `this.$store.getters.currGoods`
      activeGoods: 'currGoods'
    })
    // ...mapState({
    //   // 箭头函数可使代码更简练
    //   activeGoodsId2: state => {
    //     console.log("activeGoodsId", state);
    //     return state.count;
    //   },
    //   activeGoodsId3: "currGoods",
    //   // 传字符串参数 'count' 等同于 `state => state.count`
    //   countAlias: "count",

    //   // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    //   countPlusLocalState(state) {
    //     return state.count + this.localCount;
    //   }
    // })
  },
  beforeMount() {
    // console.log('this.$store', this.$store);
  },
  filters: {
    formatPrice(e) {
      return formatFloor(e);
    }
  },
  methods: {
    ...mapActions(['setGoods', 'asSetGoods', 'actionB']),
    onToggle() {
      this.expand = !this.expand;
    },
    onDetailClick() {
      console.log('onDetailClick', this);
      // 方式一，同步提交事务
      // this.$store.commit("SET_GOODS", this.data);
      // 方式二，异步提交action
      // this.$store.dispatch('setGoods', this.data);
      // 方式三，通过mapActions映射store的dispatch方法到自己身上
      // this.setGoods(this.data);
      // 方式四，通过mapActions映射，返回Promise, 处理回调
      this.actionB(this.data).then(() => {
        console.log('设置商品成功');
      });
      this.$emit('click', this.data);
    }
  }
};
</script>
