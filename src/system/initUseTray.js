// 托盘事件
// import { dialog } from 'electron'
import { Menu, Tray, nativeImage, ipcMain }  from 'electron'
import config from '../config/index'

// 日志
// const log = require('electron-log')
// 托盘对象
let appTray = null
// 闪烁计时器
let flashTimer = null
let count = 0

function initUseTray(app, mainWindow, isFlash) {
  const trayMenuTemplate = [
    {
      label: '显示',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: () => {
        app.exit()
        // dialog.showMessageBox({
        //     type: 'info',
        //     title: '关闭',
        //     message: '是否确认退出？',
        //     buttons: ['最小化','直接退出']
        // }, res => {
        //     if (res === 0) {
        //         if(mainWindow.isMinimized()){
        //             mainWindow = null;
        //         }else{
        //             mainWindow.minimize();
        //         }
        //     } else {
        //         mainWindow = null;
        //         app.exit();		//exit()直接关闭客户端，不会执行quit();
        //     }
        // })
      }
    }
  ]
  // 系统托盘图标
  const trayIcon = __static + '/icons/icon.ico'
  let image = nativeImage.createFromPath(trayIcon)
  appTray = new Tray(image)
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  // 设置此托盘图标的悬停提示内容
  appTray.setToolTip(config.trayName)
  // 设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)
  // 单击右下角小图标显示应用
  appTray.on('click', () => {
    mainWindow.show()
  })

  // 闪烁事件
  if(isFlash) {
    mainWindow.on('focus', () => {
      if (flashTimer) {
        clearInterval(flashTimer)
        flashTimer = null
        count = 0
        mainWindow.webContents.send('disable', { disable: false })
      }
      mainWindow.flashFrame(false)
      appTray.setImage(image)
    })
    ipcMain.on('flash', () => {
      mainWindow.flashFrame(true)
      flashTimer = setInterval(() => {
        appTray.setImage(count++ % 2 === 0 ? image : nativeImage.createFromPath(null))
      }, 500)
    })
  }
}

export default initUseTray
