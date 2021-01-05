/*
 * @Author: duoduo
 * @Date: 2019-09-07 22:26:40
 * @Last Modified by: duoduo
 * @Last Modified time: 2020-12-07 13:08:32
 * 阿里云SDK插件
 * 阿里云SDK：https://help.aliyun.com/document_detail/52204.html?spm=a2c4g.11186623.2.27.25a427c9o3uSzz
 */

const TEST = {
  requestId: '48BB5BE9-82A2-4E41-90CD-486509B715F7',
  uploadAddress:
    'eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzLWNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbSIsIkJ1Y2tldCI6Im91dGluLTI4ZjkxMTJmYjVjZjExZTk4YmZiMDAxNjNlMDI0YzZhIiwiRmlsZU5hbWUiOiJzdi81YmE4MThmMS0xNmQwYzEyOTM0OC81YmE4MThmMS0xNmQwYzEyOTM0OC5tcDQifQ==',
  uploadAuth:
    'eyJTZWN1cml0eVRva2VuIjoiQ0FJUzBBUjFxNkZ0NUIyeWZTaklyNG5DR01uVHErWVExSk9kVDBuem9EWVBUZWxEMnB6ZWlEejJJSDlJZEhWb0FPOGZ2dlUwbTJ0WTdQc1psclVxRjg4VkZCMmFNWll1c01vSG9GTCtKcGZadjh1ODRZQURpNUNqUWVCNHhaUkRtWjI4V2Y3d2FmK0FVQlhHQ1RtZDVNTVlvOWJUY1RHbFFDWnVXLy90b0pWN2I5TVJjeENsWkQ1ZGZybC9MUmRqcjhsbzF4R3pVUEcyS1V6U24zYjNCa2hsc1JZZTcyUms4dmFIeGRhQXpSRGNnVmJtcUpjU3ZKK2pDNEM4WXM5Z0c1MTlYdHlwdm9weGJiR1Q4Q05aNXo5QTlxcDlrTTQ5L2l6YzdQNlFIMzViNFJpTkw4L1o3dFFOWHdoaWZmb2JIYTlZcmZIZ21OaGx2dkRTajQzdDF5dFZPZVpjWDBha1E1dTdrdTdaSFArb0x0OGphWXZqUDNQRTNyTHBNWUx1NFQ0OFpYVVNPRHREWWNaRFVIaHJFazRSVWpYZEk2T2Y4VXJXU1FDN1dzcjIxN290ZzdGeXlrM3M4TWFIQWtXTFg3U0IyRHdFQjRjNGFFb2tWVzRSeG5lelc2VUJhUkJwYmxkN0JxNmNWNWxPZEJSWm9LK0t6UXJKVFg5RXoycExtdUQ2ZS9MT3M3b0RWSjM3V1p0S3l1aDRZNDlkNFU4clZFalBRcWl5a1QwcEZncGZUSzFSemJQbU5MS205YmFCMjUvelcrUGREZTBkc1Znb0lGS09waUdXRzNSTE5uK3p0Sjl4YmtlRStzS1VsdnpDb3NvNVNnVWt1OXRSVkZpSUlJWm5vVlkrdS9Mc3RCbkxxclBvREhudDVYUi91UHVncHRnUnVSbzhJNjM3MmJUSjQyV0c1VWI5Ty9kcHhKM2xQMFIwV2dteWRuQkR4L1NmdTJrS3ZSaHBrUnZ2WkVwUHR3eklpai9nTFpaRWlhelJteWhlZm81WG1QWEZUUW1uOGw1cEFNbXkvNjB4WHVkdmJFMlIwRVFEWTlZQ0dvQUJSVFBVUURwY015YUZPNFJNdTI2SjhHNkZDOFV6WEFUT0llaTJuY3RNSFVzaVczKytIbjZ3N2lzRUx5SUNGU21VWmd1SVpwWjRGMklkaXpNN2FIR1V3a0FMVTRid040blZlSGNNaWp4ckZRbElPS0ZCNE9vSXo5SkZGNzBOdkFKRUdXMmZkVlN0MkcyOUhWLytiYUFVZzIyK0F3OVV5QjFEbXAxQjVpWlZDQnc9IiwiQWNjZXNzS2V5SWQiOiJTVFMuTkp3U3NnRjkxY1F2TW9CRDZaQWZvNVl1aiIsIkV4cGlyZVVUQ1RpbWUiOiIyMDE5LTA5LTA3VDE1OjEzOjI3WiIsIkFjY2Vzc0tleVNlY3JldCI6IlM4TDZMQkc3cFBSMW9Nd1BtTVN4eUtLQkNuSmVjUVVVdE5CNFRIdGZzelgiLCJFeHBpcmF0aW9uIjoiMzYwMCIsIlJlZ2lvbiI6ImNuLXNoYW5naGFpIn0=',
  videoId: 'dbe01edc3bf9458283f8b3e5faaf895d'
};

// 默认Opts
const DefaultOpts = {
  // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
  userId: '1303984639806000',
  // 分片大小默认1M，不能小于100K
  partSize: 1048576,
  // 并行上传分片个数，默认5
  parallel: 5,
  // 网络原因失败时，重新上传次数，默认为3
  retryCount: 3,
  // 网络原因失败时，重新上传间隔时间，默认为2秒
  retryDuration: 2, // 开始上传
  onUploadstarted(uploadInfo) {
    console.log('onUploadstarted', uploadInfo);
    console.log(
      `onUploadStarted:${uploadInfo.file.name}, endpoint:${uploadInfo.endpoint}, bucket:${uploadInfo.bucket}, object:${uploadInfo.object}`
    );

    // 上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
    if (uploadInfo.videoId) {
      // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
    } else {
      // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
    }

    const { uploadAuth, uploadAddress, videoId } = TEST;
    console.log('onUploadstarted', this);
    // 从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
    this.setUploadAuthAndAddress(
      uploadInfo,
      uploadAuth,
      uploadAddress,
      videoId
    );
  },
  // 文件上传成功
  onUploadSucceed(uploadInfo) {
    console.log(
      `onUploadSucceed: ${uploadInfo.file.name}, endpoint:${uploadInfo.endpoint}, bucket:${uploadInfo.bucket}, object:${uploadInfo.object}`
    );
  },
  // 上传取消
  onUploadCanceled(uploadInfo, e) {
    console.error(`onUploadCanceled: `, uploadInfo, e);
  },
  // 文件上传失败
  onUploadFailed(uploadInfo, code, message) {
    console.error(
      `onUploadFailed: file:${uploadInfo.file.name},code:${code}, message:${message}`
    );
  },
  // 文件上传进度，单位：字节
  onUploadProgress(uploadInfo, totalSize, loadedPercent) {
    console.log(
      `onUploadProgress:file:${
        uploadInfo.file.name
      }, fileSize:${totalSize}, percent:${Math.ceil(loadedPercent * 100)}%`
    );
  },
  // 上传凭证超时
  onUploadTokenExpired(uploadInfo) {
    console.log('onUploadTokenExpired', uploadInfo);
    // 实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
    // https://help.aliyun.com/document_detail/55408.html
    // 从点播服务刷新的uploadAuth,设置到SDK里
    const { uploadAuth, uploadAddress, videoId } = TEST;
    console.log('resumeUploadWithAuth', this);
    // this.resumeUploadWithAuth(uploadAuth);
  },
  // 全部文件上传结束
  onUploadEnd() {
    console.log('onUploadEnd: uploaded all the files');
  }
};

export default function Init(opts = {}) {
  if (typeof AliyunUpload === 'undefined')
    return Promise.reject('上传SDK插件未正确安装，无法初始化');

  const options = Object.assign({}, DefaultOpts, opts);
  return Promise.resolve(new window.AliyunUpload.Vod(options));
}

// 实例方法示例如下(具体看官方文档):
// 添加上传文件 uploader.addFile(file)
// 删除上传文件 uploader.deleteFile(index)
// 取消单个文件上传 uploader.cancelFile(index)
// 恢复单个文件上传 uploader.resumeFile(index)
// 获取上传文件列表 uploader.listFiles()
// 清理上传文件列表 uploader.cleanList()
// 开始上传 uploader.startUpload()
// 停止上传 uploader.stopUpload()
// 上传凭证失效后恢复上传 uploader.setUploadAuthAndAddress()
// 获取断点信息 uploader.getCheckpoint(file)
