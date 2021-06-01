import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
const EAU = require('electron-asar-hot-updater')
const isDevelopment = process.env.NODE_ENV !== 'production'

function initAutoUpdate(app, mainWindow, updateUrl) {
  // 设置更新地址
  autoUpdater.setFeedURL(updateUrl)
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
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
    sendUpdateMessage(returnData.checking)
  })
  // 发现新版本
  autoUpdater.on('update-available', (info) => {
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
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    // setTimeout(() => {
    //   sendUpdateMessage(100)
    // }, 1000)
    // mainWindow.webContents.send('downloadProgress', progressObj)
    mainWindow.webContents.send('updateAppProgress', progressObj)
  })
  // 下载成功回调
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    ipcMain.on('isUpdateNow', (e, arg) => {
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })
    mainWindow.webContents.send('isUpdateNow')
  })
  // 执行自动更新检查
  ipcMain.on('checkForUpdate', (event, data) => {
    autoUpdater.checkForUpdates() // 查询是否有新版本
  })

  ipcMain.on('downloadUpdate', () => {
    // 下载
    autoUpdater.downloadUpdate()
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
    })

    EAU.check((error, last, body) => {
      if (error) {
        if (error === 'no_update_available') { return false }
        // console.log('EAU.check：' + error)
        // dialog.showErrorBox('info', error)
        return false
      }

      mainWindow.webContents.send('beginUpdate')

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
        if (state.percent >= 1) {
          // console.log('EAU.progress.percent：更新成功，请重启')
          // dialog.showMessageBox('info', 'App updated successfully! Restart it please.')
        }
      })
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
