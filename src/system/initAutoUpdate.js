import { ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
const EAU = require('electron-asar-hot-updater')
const isDevelopment = process.env.NODE_ENV !== 'production'

const log = require('electron-log')

function initAutoUpdate(app, mainWindow, updateUrl) {
  // 设置更新地址
  autoUpdater.setFeedURL(updateUrl)
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send('updateAppMessage', text)
  }
  // 更新状态
  const returnData = {
    error: { status: -1, msg: '检测更新查询异常' },
    checking: { status: 0, msg: '正在检查应用程序更新' },
    updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
    updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' }
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
  // 发现新版本
  autoUpdater.on('update-available', (info) => {
    log.info('发现新版本')
    if (!isDevelopment) {
      sendUpdateMessage(returnData.updateAva)
    } else {
      sendUpdateMessage(returnData.updateNotAva)
    }
  })
  // 当前版本为最新版本
  autoUpdater.on('update-not-available', (info) => {
    setTimeout(() => {
      hotUpdate() // 热更新检查
      sendUpdateMessage(returnData.updateNotAva)
    }, 1000)
  })
  // 更新下载进度事件(貌似不会执行方法)
  autoUpdater.on('download-progress', (progressObj) => {
    log.info('进度事件：' + JSON.stringify(progressObj))
    // setTimeout(() => {
    // sendUpdateMessage(100)
    // }, 1000)
    // mainWindow.webContents.send('downloadProgress', progressObj)
    mainWindow.webContents.send('updateAppProgress', progressObj)
  })
  // 下载成功回调
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    log.info('下载成功回调')
    ipcMain.on('isUpdateNow', (e, arg) => {
      // 退出程序并更新
      autoUpdater.quitAndInstall()
    })
    mainWindow.webContents.send('isUpdateNow')
  })
  // 执行自动更新检查
  ipcMain.on('checkForUpdate', (event, data) => {
    autoUpdater.checkForUpdates() // 查询是否有新版本
  })

  ipcMain.on('hotUpdate', () => {
    if (!isDevelopment) {
      // 增量更新
      hotUpdate()
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
      if (error) {
        if (error === 'no_update_available') {
          dialog.showMessageBox({
            title: '更新',
            type: 'info',
            message: '当前无新版本',
            noLink: true,
            buttons: ['确定']
          })
          return false
        }
        // console.log('EAU.check：' + error)
        return false
      }

      mainWindow.webContents.send('beginUpdate')
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
          // dialog.showErrorBox('info', error)
          // console.log('EAU.download：' + error)
          return false
        }
        // 通知页面显示进度条
        mainWindow.webContents.send('updateAppProgress', { percent: 100 })
        setTimeout(() => {
          if (process.platform === 'darwin') {
            app.relaunch()
            app.quit()
          } else {
            app.quit()
          }
        }, 2000)
      })
    })
  }
}

export default initAutoUpdate
