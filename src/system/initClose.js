// 关闭事件
import { ipcMain } from 'electron'

let willQuitApp = false
const isMac = process.platform === 'darwin'

function initClose(app, mainWindow) {
  // 关闭提示
  mainWindow.on('close', (e) => {
    console.log('close', willQuitApp)
    if (!willQuitApp) {
      mainWindow.webContents.send('win-close-tips', { isMac })
      e.preventDefault()
    }
  })
  app.on('before-quit', () => {
    willQuitApp = true
  })
  // 关闭事件处理
  ipcMain.on('win-close', (event, data) => {
    if (isMac) {
      if (mainWindow.isFullScreen()) { // 全屏状态下特殊处理
        mainWindow.once('leave-full-screen', function() {
          mainWindow.setSkipTaskbar(true)
          mainWindow.hide()
        })
        mainWindow.setFullScreen(false)
      } else {
        mainWindow.setSkipTaskbar(true)
        mainWindow.hide()
      }
    } else {
      if (data === 1) { // win缩小到托盘
        // mainWindow.setSkipTaskbar(true) // 使窗口不显示在任务栏中
        mainWindow.hide() // 隐藏窗口
      } else {
        app.quit() // win退出
      }
    }
  })
  ipcMain.on('win-focus', () => { // 聚焦窗口
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
      mainWindow.focus()
    }
  })
}

export default initClose
