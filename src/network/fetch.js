/*
 * @Author: lduoduo
 * @Date: 2020-07-21 22:19:36
 * @Last Modified by: zouhuan
 * @Last Modified time: 2020-11-30 16:54:41
 * 网络请求基础类库
 * https://github.com/axios/axios
 */

import axios from 'axios';
import qs from 'qs';
import JSONbig from 'json-bigint';

import ENV from '@/config/env';

const { API } = ENV;

const BigIntParse = JSONbig({ storeAsString: true }).parse;

const ResponseMiddwareBigInt = e => BigIntParse(e);

const getUrl = (opts = {}) => {
  const { method = 'get', server = 'local', path = '', data = {} } = opts;

  if (!API[server]) return;

  const prefix = /^http/.test(API[server]) ? '' : '//';

  const url = `${prefix}${API[server]}${path}`;
  if (!/get/i.test(method)) return url;

  const pfix = qs.stringify(data);
  if (!pfix) return url;

  return /\?/.test(url) ? `${url}&${pfix}` : `${url}?${pfix}`;
};

const doFetch = (opts = {}) => {
  const { method = 'get', server = '', path = '', data = {} } = opts;

  const url = getUrl(opts);

  if (!url) return;

  const options = {
    method,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url,
    transformResponse: [ResponseMiddwareBigInt]
  };

  console.log('axios options', options);

  return axios(options).then(e => {
    /* eslint-disable @typescript-eslint/camelcase */
    const { data: { code: c, result: d, message } = {}, status = 200 } = e;
    // console.log('axios', e);

    if (status === 200 && c == 0) return Promise.resolve(d);
    return Promise.reject({ message: message || '网络错误' });
  });
  // .catch(e => {
  //   console.log('e', e.message)
  // });
};

export const get = (opts = {}) => {
  return doFetch({ ...opts, method: 'GET' });
};

export const post = (opts = {}) => {
  return doFetch({ ...opts, method: 'POST' });
};

export const put = (opts = {}) => {
  return doFetch({ ...opts, method: 'PUT' });
};

export default {
  get,
  post,
  put
};
