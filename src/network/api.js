import { get, post, put } from './fetch';

export const getCategoryList = param => {
  return get({
    server: 'local',
    path: '/getCategoryList',
    data: param
  });
};

export const getCategoryIdList = param => {
  return get({
    path: '/getCategoryIdList',
    data: param
  });
};

export const getHotList = param => {
  return get({
    path: '/getHotList',
    data: param
  });
};

export default { getCategoryList, getCategoryIdList, getHotList };
