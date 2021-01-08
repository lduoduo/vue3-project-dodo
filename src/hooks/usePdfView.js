/*
 * @Author: duoduo
 * @Date: 2020-12-09 17:23:59
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-01-07 23:59:35
 * PDF渲染器
 */

import { useEffect, useRef, useState } from 'react';

import asyncLoad from '~/utils/asyncLoad';

const USE_ONLY_CSS_ZOOM = true;
const TEXT_LAYER_MODE = 1; // disable
const DEFAULT_SCALE_VALUE = 'auto';
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 10.0;

// pdf文件缓存
const cacheMap = new Map();

// 尝试初始化最大次数（失败自动重试）
const retryLimit = 5;

const usePdfView = (props) => {
  const {
    refContainer,
    loadCss = false,
    minScale = MIN_SCALE,
    maxScale = MAX_SCALE,
    onLoading,
    onViewPdf,
    onViewPage,
  } = props;

  const refViewer = useRef(null);
  const refLoadingTask = useRef(null);
  const refDocument = useRef(null);
  const refHistory = useRef(null);
  const refLinkService = useRef(null);
  const refRetryCount = useRef(0);
  const [pdfInfo, setPdfInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState('');

  const initViewer = () => {
    if (refViewer.current) return Promise.resolve();

    if (!window.pdfjsViewer) {
      console.error('pdf viewer插件未加载成功');
      return Promise.reject();
    }

    if (!refContainer.current) {
      console.error('pdf容器不存在');
      return Promise.reject();
    }

    const div = document.createElement('div');
    div.id = 'viewer';
    div.className = 'pdfViewer';
    refContainer.current.appendChild(div);

    const eventBus = new window.pdfjsViewer.EventBus();
    const linkService = new window.pdfjsViewer.PDFLinkService({
      eventBus: eventBus,
    });

    const l10n = window.pdfjsViewer.NullL10n;

    const pdfViewer = new window.pdfjsViewer.PDFViewer({
      container: refContainer.current,
      eventBus: eventBus,
      linkService: linkService,
      l10n: l10n,
      useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
      textLayerMode: TEXT_LAYER_MODE,
    });

    const pdfHistory = new window.pdfjsViewer.PDFHistory({
      eventBus: eventBus,
      linkService: linkService,
    });

    refViewer.current = pdfViewer;
    refLinkService.current = linkService;
    refHistory.current = pdfHistory;

    linkService.setViewer(refViewer);
    linkService.setHistory(pdfHistory);

    eventBus.on('pagesinit', (e) => {
      refViewer.current.currentScaleValue = DEFAULT_SCALE_VALUE;
      const { metaData: { info } = {}, _pdfInfo: { numPages } = {} } = refDocument.current;
      const { _pages: [_pageInfo = {}] = [], currentPageNumber } = refViewer.current;
      const { viewport: { scale, width, height, viewBox = [] } = {} } = _pageInfo;

      refDocument.current.metaData = {
        ...info,
        totalPage: numPages,
        currentPage: currentPageNumber,
        scale,
        width,
        height,
        pdfWidth: viewBox[2],
        pdfHeight: viewBox[3],
      };

      setPdfInfo(refDocument.current.metaData);

      // console.log('refViewer', refViewer);
      // console.log('refLinkService', refLinkService);
      // console.log('refHistory', refHistory);
    });

    // eventBus.on('pagerendered', (e) => {
    //   console.log('pagerendered', e);
    // });
    // eventBus.on('pagesloaded', (e) => {
    //   console.log('pagesloaded', e);
    // });
    eventBus.on('pagechanging', (e) => {
      setPdfInfo({ ...refDocument.current.metaData, currentPage: e.pageNumber });
      onViewPage && onViewPage(e);
    }, true);

    return Promise.resolve();
  };

  const doClear = () => {
    if (refDocument.current) {
      refDocument.current = null;
    }
    if (refViewer.current) {
      refViewer.current.setDocument(null);
    }
    if (refLinkService.current) {
      refLinkService.current.setDocument(null, null);
    }

    if (refHistory.current) {
      refHistory.current.reset();
    }
  };

  const doClose = () => {
    if (!refLoadingTask.current) return;

    refLoadingTask.current.destroy();
    refLoadingTask.current = null;
  };

  const loadPdf = (url) => {
    const pdfLoadingTask = window.pdfjsLib.getDocument({ url });

    refLoadingTask.current = pdfLoadingTask;

    pdfLoadingTask.onProgress = (e) => {
      const { total = 0, loaded } = e;
      const percent = total && loaded ? Math.floor((loaded * 100) / total) : 0;

      setProgress({ url, total, loaded, percent });
      onLoading && onLoading({ url, total, loaded, percent });
    };

    setLoading(true);
    setProgress({ url, total: 0, loaded: 0, percent: 0 });
    return pdfLoadingTask.promise
      .then((pdfDocument) => {
        console.log('pdfDocument', pdfDocument);

        setLoading(false);
        return pdfDocument.getMetadata().then((d) => ({
          url,
          pdfDocument,
          metaData: d,
        }));
      })
      .catch(({ message: msg = '网络异常，请稍后' }) => {
        setLoading(false);
        setError(msg);
      });
  };

  const doView = (e = {}) => {
    const { url, pdfDocument, metaData } = e;
    const { numPages: totalPage } = pdfDocument;

    setError('');

    doClear();

    refDocument.current = pdfDocument;
    refDocument.current.metaData = metaData;

    refViewer.current.setDocument(pdfDocument);
    refLinkService.current.setDocument(pdfDocument);
    refHistory.current.initialize({ fingerprint: pdfDocument.fingerprint });

    refDocument.current.url = url;
    onViewPdf && onViewPdf({ url, totalPage });
  };

  const loadAndViewPdf = (url) => {
    if (refDocument.current && refDocument.current.url === url) return;

    const tmp = cacheMap.get(url);

    if (tmp) return doView({ ...tmp, url });

    setLoading(true);

    loadPdf(url).then(({ pdfDocument, metaData }) => {
      const tmp = { pdfDocument, metaData };
      cacheMap.set(url, tmp);

      doView({ ...tmp, url });
    });
  };

  const viewPdf = (url) => {
    if (!url) return Promise.reject('pdf地址不存在');

    if (refViewer.current) return loadAndViewPdf(url);

    initViewer()
      .then(() => loadAndViewPdf(url))
      .catch(() => {
        if (refRetryCount.current > retryLimit) return;

        refRetryCount.current = refRetryCount.current + 1;
        setTimeout(() => viewPdf(url), 500);
      });
  };

  const zoomIn = (scale) => {
    if (scale) {
      refViewer.current.currentScaleValue = scale > maxScale ? maxScale : scale;
      return;
    }

    let newScale = refViewer.current.currentScale;

    newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.ceil(newScale * 10) / 10;
    newScale = Math.min(maxScale, newScale);

    if (newScale > maxScale) {
      newScale = maxScale;
    }

    refViewer.current.currentScaleValue = newScale;
  };

  const zoomOut = (scale) => {
    if (scale) {
      refViewer.current.currentScaleValue = scale < minScale ? minScale : scale;
      return;
    }

    let newScale = refViewer.current.currentScale;

    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.floor(newScale * 10) / 10;
    newScale = Math.max(minScale, newScale);

    if (newScale < minScale) {
      newScale = minScale;
    }

    refViewer.current.currentScaleValue = newScale;
  };

  const pageTo = (n) => {
    if (!n) return;
    if (n < 1) {
      refViewer.current.currentPageNumber = 1;
    } else if (n > refViewer.current.pagesCount) {
      refViewer.current.currentPageNumber = refViewer.current.pagesCount;
    } else {
      refViewer.current.currentPageNumber = n;
    }
  };

  const pagePrev = () => {
    const page = refViewer.current.currentPageNumber - 1;

    refViewer.current.currentPageNumber = page < 1 ? 1 : page;
  };

  const pageNext = () => {
    const page = refViewer.current.currentPageNumber + 1;

    refViewer.current.currentPageNumber =
      page > refViewer.current.pagesCount ? refViewer.current.pagesCount : page;
  };

  useEffect(() => {
    setLoading(true);

    if (loadCss) {
      asyncLoad(['https://mozilla.github.io/pdf.js/web/viewer.css']);
    }

    asyncLoad(['/lib/pdf-e5.js'])
      .then(() => {
        asyncLoad(['/lib/pdf.viewer.js']).then(() => {
          setLoading(false);
          initViewer();
        });
      })
      .catch((e) => {
        setLoading(false);
        console.error('PDF渲染脚本拉取失败，请检查网络设置', e);
      });

    return () => {
      doClear();
      doClose();
    };
  }, []);

  return {
    loading,
    progress,
    pdfInfo,
    error,
    pdfViewer: refViewer,
    viewPdf,
    zoomIn,
    zoomOut,
    pageTo,
    pagePrev,
    pageNext,
  };
};

export default usePdfView;
