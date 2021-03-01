/*
 * @Author: lduoduo
 * @Date: 2020-07-21 22:19:36
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-03-01 16:32:13
 * 网络请求基础类库
 * https://github.com/axios/axios
 */

import axios from 'axios';
import qs from 'qs';
import JSONbig from 'json-bigint';

import { API } from '/@/config/index';

axios.defaults.withCredentials = true;

const instance = axios.create({
  // baseURL: 'http://localhost:8080/api/',
  timeout: 30 * 1000,
  headers: { 'X-Custom-Header': 'foobar' },
  withCredentials: true
});

const BigIntParse = JSONbig({ storeAsString: true }).parse;

const ResponseMiddwareBigInt = e => BigIntParse(e);

const getUrl = (opts = {}) => {
  const { method = 'get', server = 'local', path = '', data = {} } = opts;

  if (API[server] === undefined) return;

  const prefix = API[server] === '' || /^http/.test(API[server]) ? '' : '//';

  const url = `${prefix}${API[server]}${path}`;
  if (!/get/i.test(method)) return url;

  const pfix = qs.stringify(data);
  if (!pfix) return url;

  return /\?/.test(url) ? `${url}&${pfix}` : `${url}?${pfix}`;
};

const getApplication = (opts = {}) => {
  const { dataType = 'json' } = opts;
  if (dataType === 'json') return 'json';
  if (dataType === 'form') return 'x-www-form-urlencoded';

  return 'json';
};

const doFetch = (opts = {}) => {
  const { method = 'get', data = {} } = opts;

  const url = getUrl(opts);

  if (!url) return;

  const application = getApplication(opts);

  const options = {
    method,
    headers: { 'content-type': `application/${application}` },
    data: application === 'json' ? data : qs.stringify(data),
    url,
    transformResponse: [ResponseMiddwareBigInt]
  };

  console.log('axios options', options);

  return instance(options).then(e => {
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

export const form = (opts = {}) => {
  return doFetch({ ...opts, method: 'post', dataType: 'form' });
};

export default get;
