let prefix = '';

if (typeof global !== 'undefined') {
  prefix = global.env === 'test' ? 't-' : global.env === 'uat' ? 'u-' : '';
} else {
  const { hostname } = window.location;

  if (/^t-/.test(hostname)) {
    prefix = 't-';
  } else if (/^localhost/.test(hostname) || /^\d+/.test(hostname)) {
    prefix = 't-';
  } else if (/^u-/.test(hostname)) {
    prefix = 'u-';
  } else {
    prefix = '';
  }
}

console.log('prcess.env', process.env.NODE_ENV, prefix);

// const isDev = 0;
const isDev = process.env.NODE_ENV === 'development';

export const myDomain = 'dodo.com';

export const EncrptKey = 'dododo';

export default {
  prefix,
  myDomain,
  API: {
    local: 'http://localhost:10002',
    temp: isDev ? '' : `https://${prefix}api.${myDomain}`
  }
};
