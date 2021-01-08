import NativeModule from 'module'
// import { Files } from './bundle.mjs'
// import { EvaluateModule } from './module.mjs'

export function createRequire (basedir, files, evaluateModule) {
  const nativeRequire = NativeModule.createRequire ? NativeModule.createRequire(basedir) : require

  const resolveFromFiles = function (id) {
    const _id = id.replace(/^\.\//, '')
    if (files[_id]) {
      return _id
    }
  }

  function _resolve (id) {
    return resolveFromFiles(id) || nativeRequire.resolve(id, {
      paths: [basedir]
    })
  }

  _resolve.paths = nativeRequire.resolve.paths.bind(nativeRequire.resolve)

  const _require = function (id) {
    const _resolvedFile = resolveFromFiles(id)
    if (_resolvedFile) {
      return evaluateModule(_resolvedFile, {})
    }

    return nativeRequire(_resolve(id))
  }

  _require.resolve = _resolve
  _require.cache = {}
  _require.main = undefined

  // require.extensions was deprecated since v0.12.0
  // eslint-disable-next-line node/no-deprecated-api
  _require.extensions = nativeRequire.extensions

  return _require
}
