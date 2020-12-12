/*
 * @Author: zouhuan
 * @Date: 2019-08-11 22:38:17
 * @Last Modified by: zouhuan
 * @Last Modified time: 2020-11-30 18:12:33
 * 价格格式化
 */

// price: 价格，num: 保留位数
export const format = (price = 0, num = 2) => {
  return Number(price).toFixed(num);
};

// 超过一百不展示小数
export const formatFloor = (price = 0, num = 2) => {
  if (price > 1000) return '999+';
  return price > 100 ? '99+' : Number(price).toFixed(num);
};

export const format$ = (price = 0, num = 2) => {
  return `￥${Number(price).toFixed(num)}`;
};

// 超过一百不展示小数
export const format$Floor = (price = 0, num = 2) => {
  if (price > 1000) return '￥999+';
  return price > 100 ? `￥99+` : `￥${Number(price).toFixed(num)}`;
};

export default format;
