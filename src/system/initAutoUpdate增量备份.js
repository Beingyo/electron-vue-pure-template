import { ipcMain, dialog } from 'electron'
const EAU = require('electron-asar-hot-updater')
const isDevelopment = process.env.NODE_ENV !== 'production'

const log = require('electron-log');

function initAutoUpdate(app, mainWindow, updateUrl) {
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
