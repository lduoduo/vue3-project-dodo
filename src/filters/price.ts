import Vue from 'vue';
import { formatFloor } from '@/utils/price';

Vue.filter('filterFormatPrice', (e: number) => {
  return formatFloor(e);
});
