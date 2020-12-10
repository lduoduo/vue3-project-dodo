<template>
  <div
    :class="['comp-hot-item', activeGoodsId === data.goodsId ? 'active' : '']"
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
            formatPrice(data.vipPromotionPrice)
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapGetters, mapActions } from 'vuex';
import { ImagePreview } from 'vant';

import Iconfont from '@/components/Iconfont.vue';
import ImageLoad from '@/components/ImageLoad.vue';

import { GoodsModule } from '@/store-vuex-ts/modules/goods';
import { format$Floor, formatFloor } from '@/utils/price';

import { GoodsItemData } from '../../interface';

@Component({
  name: 'HotItemTs',
  components: {
    ImageLoad,
    Iconfont
  }
})
export default class App extends Vue {
  @Prop({ default: {}, required: true })
  private data!: GoodsItemData;

  get activeGoodsId() {
    // console.log("activeGoodsId GoodsModule", GoodsModule);
    return GoodsModule.data.goodsId;
  }

  get currDay() {
    const NOW = new Date();
    const MONTH = NOW.getMonth() + 1;
    const DAY = NOW.getDate();

    return `${MONTH}-${DAY}`;
  }

  get vip() {
    return /(5|3)/.test(`${this.data.merchantType}`);
  }

  get imageArr() {
    return this.data.imageList.slice(0, 3);
  }

  mounted() {
    // this.state.fetchUsers();
    // console.log("this.state store, GoodsModule", this.data, this.$store, GoodsModule);
  }

  private formatPrice(e: number) {
    return formatFloor(e);
  }

  private onDetailClick() {
    console.log('onDetailClick', this);
    GoodsModule.actionB(this.data).then(() => {
      console.log('设置商品成功');
    });
    this.$emit('click', this.data);
  }

  private onIamgeClick(i: number) {
    console.log('onIamgeClick', i);
    ImagePreview({
      images: this.data.imageList,
      startPosition: i,
      onClose() {
        // do something
      }
    });
  }

  private onShareText() {
    console.log('onShareText');
  }

  private onSharePoster() {
    console.log('onSharePoster');
  }
}
</script>
