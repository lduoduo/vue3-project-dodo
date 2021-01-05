const { ssrBuild, build } = require('vite');

(async () => {
  await build({
    esbuildTarget: 'es2018',
    outDir: 'dist/client',
    rollupInputOptions: {
      input: './w-ssr/entry-client-before-page.ts'
    },
  })

  await ssrBuild({
    esbuildTarget: 'es2018',
    outDir: 'dist/server',
    rollupInputOptions: {
      input: './w-ssr/entry-server.ts'
    },
  })
})()