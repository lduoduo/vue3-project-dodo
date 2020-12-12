/**
 * @Author: lduoduo
 * @Date: 2018-01-07 23:29:50
 * @Last Modified by: zouhuan
 * @Last Modified time: 2020-12-11 16:26:51
 *
 * asynLoad 延迟异步加载 js / css文件
 * 调用方式:
 * 1. import { asynLoad } from 'utils';
 * 2. asynLoad(['url1','url2']).then()
 * 3. asynLoad('url3').then()
 *
 */

const cacheMap = new Map();

interface HTMLElement extends Element {
  rel?: string;
  href?: string;
  src?: string;
  onload: any;
}

function loadResource(url: string) {
  // 先判断是否已经加载过，加载过的不再重新加载
  if (cacheMap.get(url)) return Promise.resolve();

  let dom: HTMLElement;

  // 加载css
  if (/\.css$/.test(url)) {
    dom = document.createElement('link');
    dom.rel = 'stylesheet';
    dom.href = url;
  } else {
    dom = document.createElement('script');
    dom.src = url;
  }

  dom.id = url;
  return new Promise<void>((resolve, reject) => {
    dom.onload = () => {
      dom.remove();
      resolve();
    };
    document.body.appendChild(dom);
  });
}

/**
 *
 *
 * @export
 *
 * @param {String / Array} url 目标地址 或者地址列表
 * @return Promise
 */
export default function(url: string | Array<string>) {
  if (!url) return Promise.reject('');

  if (url.constructor === String) {
    return loadResource(url);
  }

  if (url.constructor === Array) {
    const arr: Array<Promise<void>> = [];
    url.map((item: string) => {
      arr.push(loadResource(item));
    });
    return Promise.all(arr);
  }
  return Promise.reject(`unknown parameter type of asynLoad ${url}`);
}
