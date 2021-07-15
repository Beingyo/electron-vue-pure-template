<template>
  <el-dialog
    :title="UpdateInfo.title"
    :visible.sync="UpdateInfo.show"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    width="50%"
    top="45vh"
  >
    <div class="conten">
      <el-progress
        :percentage="UpdateInfo.percentage"
        :color="UpdateInfo.colors"
        :status="UpdateInfo.progressStaus"
      ></el-progress>
    </div>
  </el-dialog>
</template>

<script>
const log = require('electron-log')
export default {
  data() {
    return {
      UpdateInfo: {
        show: false,
        percentage: 0,
        title: '下载进度',
        progressStaus: null,
        colors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#6f7ad3', percentage: 60 },
          { color: '#1989fa', percentage: 80 },
          { color: '#5cb87a', percentage: 100 }
        ]
      }
    }
  },
  created() {},
  mounted() {
    this.checkForUpdate()
    /**
     * 主进程返回的检测状态
     */
    this.$electron.ipcRenderer.on('updateAppMessage', (event, data) => {
      switch (data.status) {
        case -1:
          console.log('updateAppMessage-error:' + data.msg)
          console.log('增量更新')
          log.info('增量更新')
          // this.$message.error(data.msg)
          break
        case 0:
          console.log('updateAppMessage-loading:' + data.msg)
          this.$message.info(data.msg)
          log.info('case: 0')
          break
        case 1:
          console.log('updateAppMessage-loading:' + data.msg)
          console.log('全量更新')
          log.info('判断全量更新')
          //   this.updateApp()
          break
      }
    })
  },
  methods: {
    downloadUpdate() {
      var _this = this
      // var _isHotUpdate = false
      this.$electron.ipcRenderer.send('hotUpdate')
      this.$electron.ipcRenderer.on('beginUpdate', () => {
        // 开始更新
        // _isHotUpdate = true
        _this.UpdateInfo.show = true
      })
      // 更新进度
      this.$electron.ipcRenderer.on('updateAppProgress', (event, data) => {
        _this.UpdateInfo.percentage = data.percent.toFixed(0) // (data.percent).toFixed(2);
        console.log('进度条：data.percent =' + data.percent)
        log.info('进度条：data.percent =' + data.percent)
        // if (data.percent >= 100) {
        //   _this.UpdateInfo.title = '下载完成，即将自动重启应用'
        //   if (_isHotUpdate) {
        //     // _this.UpdateInfo.show = false;
        //   } else {
        //     setTimeout(() => {
        //       _this.$electron.ipcRenderer.on('isUpdateNow', () => {
        //         _this.$electron.ipcRenderer.send('isUpdateNow')
        //       })
        //     }, 1000)
        //   }
        // }
      })
    },
    // 暂时没用
    updateApp() {
      var _this = this
      _this
        .$confirm('版本有更新，是否立即更新！')
        .then(() => {
          _this.UpdateInfo.show = true
        })
        .catch(() => {})
    },
    checkForUpdate() {
      // 全量更新：即将执行——downloadUpdate
      // this.$electron.ipcRenderer.send('checkForUpdate', 'a')
      // this.$electron.ipcRenderer.on('isUpdateNow', () => {
      //   // 发送立即更新
      //   this.$electron.ipcRenderer.send('isUpdateNow')
      // })
      this.downloadUpdate()
    }
  }
}
</script>
