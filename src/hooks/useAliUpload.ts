/*
 * @Author: zouhuan
 * @Date: 2020-12-08 17:07:30
 * @Last Modified by: zouhuan
 * @Last Modified time: 2020-12-11 18:49:07
 * 阿里云上传
 * 初始入参: fetchUploadAuth(获取上传凭证的fn, 返回promise)
 * 上传步骤：添加文件(addFile) => startUpload
 * 支持多文件上传（非同时上传，这是SDK的机制，只能一个一个上传）
 * 实时播放入参: videoId, playAuth (视频id和播放凭证)
 */
import { ref, onUnmounted } from 'vue';

import asyncLoad from '/@/utils/asyncLoad';
import { get, post } from '/@/network/fetch-zfl';

import Init from './uploaderConsts';

// 示例代码：获取上传凭证
const defaultFetchUploadAuth = (param: { title: any; name: any }) => {
  const { title, name } = param;

  return post('/api/duncan/v1/media/vod/org/up/url', { fileName: name }).then(
    e => {
      const { code, result = {}, message: msg } = e;
      if (+code) return Promise.reject(msg);
      return Promise.resolve(result);
    }
  );
};

const useAliUpload = (props: Record<string, any>) => {
  const {
    fetchUploadAuth = defaultFetchUploadAuth,
    onUploadStarted,
    onUploadSucceed,
    onUploadFailed,
    onUploadProgress,
    onUploadEnd
  } = props;

  const refSDK = ref(null);
  const loading = ref(false);
  const progressList = ref([]);

  const initUploader = () => {
    Init({
      onUploadstarted(uploadInfo: { file: any }) {
        loading.value = true;

        fetchUploadAuth(uploadInfo.file)
          .then((e: { uploadAuth: any; uploadAddress: any; videoId: any }) => {
            const { uploadAuth, uploadAddress, videoId } = e;
            console.log('uploadInfo fetchUploadUrl', uploadInfo, e, this);

            // 更新上传列表
            progressList.value.push({ ...uploadInfo, ...e });

            // 从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
            refSDK.value.setUploadAuthAndAddress(
              uploadInfo,
              uploadAuth,
              uploadAddress,
              videoId
            );

            onUploadStarted && onUploadStarted({ ...e, file: uploadInfo.file });
          })
          .catch((e: any) => {
            console.error(e);
            refSDK.value.stopUpload();
          });
      },
      onUploadSucceed(uploadInfo: any) {
        onUploadSucceed && onUploadSucceed(uploadInfo);
      },
      onUploadFailed(e: any, code: any, message: any) {
        onUploadFailed && onUploadFailed({ info: e, code, message });
      },
      onUploadProgress(
        uploadInfo: { videoId: any },
        totalSize: any,
        percent: number
      ) {
        const { videoId } = uploadInfo;

        const i = progressList.value.findIndex(
          (d: any) => d.videoId === videoId
        );
        if (i < 0) return;

        progressList.value.totalSize = totalSize;
        progressList.value.percent = Math.ceil(percent * 100);

        onUploadProgress && onUploadProgress(progressList.value);
      },
      onUploadEnd() {
        loading.value = false;
        onUploadEnd && onUploadEnd();
      }
    }).then((SDK: null) => {
      refSDK.value = SDK;
    });
  };

  asyncLoad([
    'https://static.zuifuli.com/libs/aliyun-oss-sdk-5.3.1.min.js',
    'https://static.zuifuli.com/libs/aliyun-upload-sdk-1.5.0.min.js'
  ]).then(() => setTimeout(initUploader, 0));

  onUnmounted(() => {
    refSDK.value?.dispose && refSDK.value.dispose();
  });

  return {
    loading,
    progressList,
    aliUploader: refSDK,
    addFile: e => refSDK.value.addFile(e),
    startUpload: () => refSDK.value.startUpload(),
    stopUpload: () => refSDK.value.stopUpload()
  };
};

export default useAliUpload;
