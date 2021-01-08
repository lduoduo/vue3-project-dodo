let B;
(async () => {
 B = await import('./b.mjs');
  console.log('B', B);
})();

const A = {
  A: 1,
  B,
}

module.exports = A;