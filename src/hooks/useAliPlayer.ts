/*
 * @Author: duoduo
 * @Date: 2019-09-22 10:45:59
 * @Last Modified by: lduoduo
 * @Last Modified time: 2021-02-26 12:49:37
 * 阿里web播放器组件
 * 初始入参: playerId(播放容器domId), autoplay
 * 实时播放入参: videoId, playAuth (视频id和播放凭证)
 * 阿里云播放器：https://help.aliyun.com/document_detail/125570.html?spm=a2c4g.11186623.6.1075.10c26bd1uTOFbi#h2-u626Bu63CFu4F53u9A8C6
 * 使用说明：
 * 1. 业务上需要提供播放器外层容器的dom元素id
 * 2. 调用play方法需要传入videoId和playauth
 */

import { useEffect, useRef, useState } from 'react';

import asyncLoad from '~/utils/asyncLoad';
import { get, post } from '/@/network/fetch';

// 示例代码：获取播放凭证
const defaultFetchPlayAuth = param => {
  const { mediaId } = param;

  return post('/api/duncan/v1/media/vod/play/auth', { mediaId });
};

const useAliUpload = props => {
  const { autoplay = true, playerId, onPlayStart, onPlayEnd } = props;

  const refSDK = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    asyncLoad([
      '/lib/aliplayer-min-2-8-2.css',
      '/lib/aliplayer-h5-min-2-8-2.js',
      '/lib/aliplayer-vod-min-2-8-2.js'
    ]);

    return () => {
      // console.log('播放器销毁', refSDK.current.dispose);
      refSDK.current?.dispose && refSDK.current.dispose();
    };
  }, []);

  const initPlayer = (opts = {}) => {
    const { videoId, playAuth } = opts;

    console.log('initPlayer', { playerId, autoplay, videoId, playAuth });

    refSDK.current = new window.Aliplayer({
      id: playerId,
      width: '100%',
      height: '100%',
      videoWidth: '100%',
      videoHeight: '100%',
      autoplay,
      vid: videoId,
      playauth: playAuth,
      enableSystemMenu: true
    });

    refSDK.current.on('playing', e => {
      setPlaying(true);
      onPlayStart && onPlayStart(e);
    });
    refSDK.current.on('ended', e => {
      playing && onPlayEnd && onPlayEnd(e);
      setPlaying(false);
    });
    refSDK.current.tag.addEventListener('click', onPlayerClick);
  };

  const onPlayerClick = () => {
    if (!refSDK.current) return;

    if (refSDK.current._status === 'pause') {
      return refSDK.current.play();
    }
    return refSDK.current.pause();
  };

  const play = (opts = {}) => {
    if (!refSDK.current) return initPlayer(opts);

    const { videoId, playAuth } = opts;

    refSDK.current.replayByVidAndPlayAuth(videoId, playAuth);
  };

  const stop = () => {
    if (!refSDK.current) return;

    return refSDK.current.pause();
  };

  return {
    playing,
    aliPlayer: refSDK,
    play,
    stop
  };
};

export default useAliUpload;
