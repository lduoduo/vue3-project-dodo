
function renderStyles(ssrContext, renderContext) {
  const initial = renderContext.preloadFiles || [];
  const async = getUsedAsyncFiles(ssrContext, renderContext) || [];
  const cssFiles = initial.concat(async).filter(({ file }) => isCSS(file));
  return cssFiles
    .map(({ file }) => {
      return `<link rel="stylesheet" href="${renderContext.publicPath}${file}">`;
    })
    .join('');
}

function renderResourceHints(ssrContext, renderContext) {
  return (
    renderPreloadLinks(ssrContext, renderContext) +
    renderPrefetchLinks(ssrContext, renderContext)
  );
}

function renderScripts(ssrContext, renderContext) {
  if (renderContext.clientManifest && renderContext.preloadFiles) {
    const initial = renderContext.preloadFiles.filter(({ file }) => isJS(file));
    const async = (
      getUsedAsyncFiles(ssrContext, renderContext) || []
    ).filter(({ file }) => isJS(file));
    const needed = [initial[0]].concat(async, initial.slice(1));
    return needed
      .map(({ file }) => {
        return `<script src="${renderContext.publicPath}${file}" defer></script>`;
      })
      .join('');
  } else {
    return '';
  }
}

function getPreloadFiles(ssrContext, renderContext) {
  const usedAsyncFiles = getUsedAsyncFiles(ssrContext, renderContext);
  if (renderContext.preloadFiles || usedAsyncFiles) {
    return (renderContext.preloadFiles || []).concat(usedAsyncFiles || []);
  } else {
    return [];
  }
}

function getUsedAsyncFiles(ssrContext, renderContext) {
  if (
    !ssrContext._mappedFiles &&
    ssrContext._registeredComponents &&
    renderContext.mapFiles
  ) {
    const registered = Array.from(ssrContext._registeredComponents);
    ssrContext._mappedFiles = renderContext
      .mapFiles(registered)
      .map(normalizeFile);
  }
  return ssrContext._mappedFiles || [];
}