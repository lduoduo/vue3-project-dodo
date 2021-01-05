const path = require('path');
const fs = require('fs');

const resolve = pn => path.resolve(__dirname, pn);

const json = fs.readFileSync(
  resolve('../../dist/vue-ssr-server-bundle.json'),
  'utf-8'
);

const t = json.replace(/\/esm\//g, '/');

fs.writeFile(resolve('../../dist/vue-ssr-server-bundle.json'), t, err => {
  if (err) throw err;
  console.log('去掉esm');
});
