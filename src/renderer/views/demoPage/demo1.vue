<template>
  <div>
    <el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      UpdateInfo: {
        show: false,
        percentage: 0,
        title: '正在下载新版本',
        progressStaus: null,
        colors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#6f7ad3', percentage: 60 },
          { color: '#1989fa', percentage: 80 },
          { color: '#5cb87a', percentage: 100 }
        ],
        updateType: 0,
        isHotUpdate: false,
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
          this.$message.info(data.msg)
          break
        case 0:
          // 检测版本
          console.log('updateAppMessage:' + data.msg)
          // this.$message.info(data.msg)
          break
        case 1:
          // 发现全量版本
          console.log('updateAppMessage:' + data.msg)
          this.updateType = 1
          this.updateApp()
          break
        case 2:
          // 发现增量版本
          console.log('updateAppMessage:' + data.msg)
          this.updateType = 2
          this.updatePart()
          break
      }
    })
  },
  methods: {
    toIndex() {
      this.$router.push({ path: '/' })
    },
    downloadUpdate() {
      var _this = this
      // 更新进度
      this.$electron.ipcRenderer.on('updateAppProgress', (event, data) => {
        _this.UpdateInfo.percentage = data.percent.toFixed(0) // (data.percent).toFixed(2);
        console.log('进度条：data.percent =' + data.percent)
        if (data.percent >= 100) {
          _this.UpdateInfo.title = '下载完成，即将自动重启应用'
          setTimeout(() => {
              _this.isHotUpdate === true ? _this.$electron.ipcRenderer.send('isUpdatePartNow') : _this.$electron.ipcRenderer.send('isUpdateNow')
          }, 3000)
        }
      })
    },
    // 全量更新
    updateApp() {
      this.$confirm('发现重大版本，是否进行更新?', '更新', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.UpdateInfo.show = true
        this.$electron.ipcRenderer.send('startDownload')
      }).catch(() => {
      });
    },
    // 增量更新
    updatePart() {
      this.$confirm('发现增量版本，是否进行更新?', '更新', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.UpdateInfo.show = true
        this.isHotUpdate = true
        //下载增量资源包
        this.$electron.ipcRenderer.send('partDownload')
      }).catch(() => {
      });
    },
    // 检测更新状态
    checkForUpdate() {
      this.$electron.ipcRenderer.send('checkForUpdate', 'a')
      this.downloadUpdate()
    }
  }
}
</script>
