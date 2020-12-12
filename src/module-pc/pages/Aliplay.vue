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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Uploader } from 'vant';

// import 'vant/lib/uploader/style';

export default defineComponent({
  components: {
    Uploader
  },
  setup(props, context) {
    console.log('props context', props, context);
  },
  methods: {
    onFileChange(e) {
      console.log('onFileChange', e);
    }
  }
});
</script>

<style lang="scss">
@import url('vant/lib/uploader/index');

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
