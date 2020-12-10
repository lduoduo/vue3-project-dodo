let prefix = '';

if (typeof global !== undefined) {
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

export default {
  prefix,
  API: {
    local: 'http://localhost:10002',
    dodo: 'https://1002.mp.duoduogai.com'
  }
};
