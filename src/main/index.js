import { app, BrowserWindow, ipcMain } from 'electron'
import initSys from '../system/index.js'

let willQuitApp = false

const isMac = process.platform === 'darwin'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1200,
    webPreferences: {
      webSecurity: false, // 取消跨域
      nodeIntegration: true, // 允许node
      contextIsolation: false // v12版本 允许node
    }
  })

  mainWindow.loadURL(winURL)

  // 初始化系统配置
  initSys(app, mainWindow)
  
  mainWindow.on('enter-full-screen', () => {
    isMac && app.commandLine.appendSwitch('disable-pinch', true)
  })
  mainWindow.on('leave-full-screen', () => {
    isMac && app.commandLine.appendSwitch('disable-pinch', false)
  })

  // mainWindow.on('closed', () => {
  //   mainWindow = null
  // })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // if (!isMac) {
  //   app.quit()
  // }
})

app.on('activate', () => {
  // if (mainWindow === null) {
  //   createWindow()
  // }
  mainWindow.show()
})

// app.on('before-quit', () => {
//   willQuitApp = true
// })

app.allowRendererProcessReuse = false

