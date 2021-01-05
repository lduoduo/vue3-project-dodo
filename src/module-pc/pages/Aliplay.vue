<template>
  <h1 class="head">阿里云上传和播放</h1>
  <div class="block">
    <p>上传SDK调用 (仅HOOKS)</p>
    <p>* 初始入参: fetchUploadAuth(获取上传凭证的fn, 返回promise)</p>
    <p>* 上传步骤：添加文件(addFile) => startUpload</p>
    <p>* 支持多文件上传（非同时上传，这是SDK的机制，只能一个一个上传）</p>
  </div>
  <div class="block">
    <p>播放器SDK调用 (仅HOOKS)</p>
    <p>* 初始入参: playerId(播放容器domId), autoplay</p>
    <p>* 实时播放入参: videoId, playAuth (视频id和播放凭证)</p>
  </div>
  <div class="block">
    <Uploader
      accept=".mp4,.avi,.mpg,.mpeg,.3gb,.wmv,.mkv,.mov,"
      :after-read="onFileChange"
    />
    <Button
      type="primary"
      loading-text="加载中..."
      :disabled="!this.fileList.length"
      :loading="this.loading.value"
      @click="onUpload"
      >上传</Button
    >
  </div>

  <div class="block file-list">
    <div v-for="item in fileList" :key="item.name">
      <p>
        <span>{{ item.file.name }}</span>
        <span :style="{ marginLeft: '8px' }">{{ item.file.size }}</span>
      </p>
      <Progress :percentage="item.percent || 0" stroke-width="8" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
  nextTick,
  ref,
  defineComponent,
} from 'vue';
import { Button, Uploader, Progress } from 'vant';

import { get, post } from '/@/network/fetch';

import useAliUpload from '/@/hooks/useAliUpload';

// import 'vant/lib/uploader/style';

// 示例代码：获取上传凭证
const defaultFetchUploadAuth = (param: { title: any; name: any }) => {
  const { title, name } = param;

  return post({
    server: 'temp',
    path: '/api/duncan/v1/media/vod/org/up/url',
    data: { fileName: name },
  });
};

export default defineComponent({
  components: {
    Button,
    Uploader,
    Progress,
  },
  setup(props, context) {
    const state = reactive({
      fileList: [], // 文件列表
      isLogin: false, // 是否已登录
    });

    const tmp = useAliUpload({
      fetchUploadAuth: defaultFetchUploadAuth,
      onUploadStarted: (e) => console.log('onUploadStarted', e),
      onUploadSucceed: (e) => console.log('onUploadSucceed', e),
      onUploadFailed: (e) => console.log('onUploadFailed', e),
      onUploadProgress: (e) => {
        debugger;

        console.log('onUploadProgress1', e);

        const i = state.fileList.findIndex((d) => d.file === e.file);
        if (i < 0) return;

        state.fileList[i] = { ...state.fileList[i], ...e };
        console.log('onUploadProgress2', state.fileList[i], i);
      },
      onUploadEnd: (e) => console.log('onUploadEnd', e),
    });

    console.log('tmp props context1', tmp, props, context);

    const {
      loading,
      progressList,
      aliUploader,
      addFile,
      startUpload,
      stopUpload,
    } = tmp;

    const onFileChange = (e) => {
      console.log('onFileChange', e);
      if (state.fileList.find((d) => d.file.name === e.file.name)) return;

      state.fileList.push(e);
    };

    const onUpload = () => {
      state.fileList.map((d) => addFile(d.file));
      startUpload();
    };

    console.log('progressList', state.fileList, progressList);

    return { ...toRefs(state), loading, onFileChange, onUpload };
  },
});
</script>

<style lang="scss">
@import url('vant/lib/uploader/index');
@import url('vant/lib/progress/index');

.head {
  text-align: center;
}

.block {
  background-color: #fff;
  margin: 12px 0;
  padding: 12px;

  p {
    margin: 0;
  }
}
</style>
