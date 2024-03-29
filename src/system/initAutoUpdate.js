// 更新时间
import { ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
const EAU = require('electron-asar-hot-updater')
const log = require('electron-log')

const isDevelopment = process.env.NODE_ENV !== 'production'

function initAutoUpdate(app, mainWindow, updateUrl) {
  // 设置更新地址
  autoUpdater.setFeedURL(updateUrl) // 设置全量更新包url
  autoUpdater.autoDownload = false // 发现全量版本后暂时不下载
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send('updateAppMessage', text)
  }
  // 更新状态
  const returnData = {
    error: { status: -1, msg: '检测更新查询异常' },
    updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' },
    checking: { status: 0, msg: '正在检查应用程序更新' },
    updateAva: { status: 1, msg: '检测到全量版本' },
    updatePart: { status: 2, msg: '检测到增量版本' }
  }
  // 更新错误
  autoUpdater.on('error', () => {
    sendUpdateMessage(returnData.error)
  })
  // 检查中
  autoUpdater.on('checking-for-update', () => {
    log.info('检查中')
    sendUpdateMessage(returnData.checking)
  })
  // 发现全量版本
  autoUpdater.on('update-available', (info) => {
    log.info('发现全量版本' + JSON.stringify(info))
    if (autoUpdater.autoDownload === false) { // 不自动下载更新包时返回更新状态信息
      sendUpdateMessage(returnData.updateAva)
    }
  })
  // 没有发现全量版本
  autoUpdater.on('update-not-available', (info) => {
    setTimeout(() => {
      log.info('检查增量更新' + JSON.stringify(info))
      hotUpdate() // 检查增量更新
    }, 1000)
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    log.info('进度事件：' + JSON.stringify(progressObj))
    mainWindow.webContents.send('updateAppProgress', progressObj)
  })
  // 下载成功回调
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    log.info('下载成功回调')
    mainWindow.webContents.send('updateAppProgress', { percent: 100 })
    ipcMain.on('isUpdateNow', () => {
      // 退出程序并更新
      log.info('收到更新命令')
      autoUpdater.quitAndInstall()
    })
  })
  // 执行自动更新检查
  ipcMain.on('checkForUpdate', () => {
    if (!isDevelopment) {
      autoUpdater.checkForUpdates() // 查询是否有全量版本
    } else {
      dialog.showMessageBox({
        title: '更新',
        type: 'info',
        message: '当前不是生产环境',
        noLink: true,
        buttons: ['确定']
      })
    }
  })
  // 下载安装包
  ipcMain.on('startDownload', () => {
    autoUpdater.autoDownload = true
    autoUpdater.checkForUpdates() // 查询是否有全量版本
  })

  // 增量更新配置
  function hotUpdate() {
    // post请求方法
    EAU.init({
      'api': 'http://127.0.0.1:10202/test/update', // The API EAU will talk to
      'server': false // Where to check. true: server side, false: client side, default: true.
      // 'debug': false, // Default: false.
      // 'headers': { Authorization: 'token' }, // Default: {}
      // 'body': {
      //   name: packageInfo.name,
      //   current: packageInfo.version
      // }, // Default: name and the current version
      // 'formatRes': function(res) { return res } // Optional,Format the EAU.check response body, exemple => {version: xx, asar: xx}

      // 接口JSON数据示例：
      // {
      //   "name": "app",
      //   "version": "2.0.1",
      //   "asar": "http://127.0.0.1:10001/electron-verson/update.zip",
      //   "info": "test"
      // }
    })
    // 检测更新
    EAU.check((error, last, body) => {
      if (error === 'no_update_available') {
        dialog.showMessageBox({
          title: '更新',
          type: 'info',
          message: '当前无新版本',
          noLink: true,
          buttons: ['确定']
        })
        log.info('当前无新版本：' + JSON.stringify(last))
        log.info('当前无新版本：' + JSON.stringify(body))
        return false
      }
      if (error === 'cannot_connect_to_api') {
        dialog.showMessageBox({
          title: '失败',
          type: 'error',
          message: '无法连接服务器',
          noLink: true,
          buttons: ['确定']
        })
        return false
      }
      ipcMain.on('partDownload', () => {
        // 返回下载进度
        EAU.progress((state) => {
          // console.log('EAU.progress.percent：' + state.percent)
          mainWindow.webContents.send('updateAppProgress', { percent: state.percent * 100 })
          // state的数据示例:
          // {
          //   percent: 0.5,
          //   speed: 554732,
          //   size: {
          //     total: 90044871,
          //     transferred: 27610959
          //   },
          //   time: {
          //     elapsed: 36.235,
          //     remaining: 81.403
          //   }
          // }
        })
        // 下载完成,即将更新
        EAU.download((error) => {
          if (error) {
            dialog.showErrorBox('info', error)
            // console.log('EAU.download：' + error)
            return false
          }
          // 通知页面显示进度条
          mainWindow.webContents.send('updateAppProgress', { percent: 100 })
          ipcMain.on('isUpdatePartNow', () => {
            if (process.platform === 'darwin') {
              app.relaunch()
              app.quit()
            } else {
              app.quit()
            }
          })
        })
      })
      // 告知渲染进程发现增量版本
      sendUpdateMessage(returnData.updatePart)
    })
  }
}

export default initAutoUpdate
