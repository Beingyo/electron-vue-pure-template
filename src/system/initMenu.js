import { app, dialog, Menu, ipcMain } from 'electron'
// import config from '@config/config'

const config = require('@config/config')
const os = require('os')
const isMac = process.platform === 'darwin'
const { version } = require('../../package.json')

var lang = 'zh_CN'
var menuData = require('./lang/' + lang + '.json')
var menuConfig = []

function init() {
  menuConfig = [
    {
      label: app.name,
      // label: menuData.about,
      submenu: [{
        label: menuData.about.label, // 关于
        accelerator: isMac ? 'Alt+Cmd+I' : 'Alt+Shift+I',
        click: function () {
          info()
        }
      }]
    },
    {
      label: menuData.setting.label, // 设置
      submenu: [
        {
          label: menuData.setting.reload, // 快速重启
          accelerator: 'CmdOrCtrl+F5',
          role: 'reload'
        },
        {
          label: menuData.setting.quit, // 退出
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit'
        }
      ]
    },
    {
      label: menuData.toggledevtools.label, // 切换到开发者工具
      submenu: [{
        label: menuData.toggledevtools.tool,  // 开发者工具
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    }
  ]
}

function info() {
  console.log(process.versions)
  dialog.showMessageBox({
    title: menuData.about.info.title, // 关于
    type: 'info',
    message: menuData.about.info.title.message,
    detail: `版本信息：\nelectron版本：${process.versions.electron}\n当前系统：${os.type()} ${os.arch()} ${os.release()}\n当前版本：${version}`,
    // detail: `版本信息：\n产品名称：${name}\nelectron版本：${process.versions.electron}\n当前系统：${os.type()} ${os.arch()} ${os.release()}\n当前版本：${version}`,
    noLink: true,
    buttons: [menuData.about.info.buttons.sure] // 确定
  })
}

// 设置开发者工具
function setTool(mainWindow) {
  if (config.devToolsShow) {
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
    mainWindow.webContents.openDevTools({ mode: 'right' })
  } else {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
    // mainWindow.webContents.openDevTools({ mode: 'right' })
    // mainWindow.webContents.closeDevTools()
  }
}

// 设置菜单栏
function setMenu() {
  let menu
  if (config.devToolsShow) {
    menu = Menu.buildFromTemplate(menuConfig)
    Menu.setApplicationMenu(menu)
  } else {
    if (isMac) {
      menu = Menu.buildFromTemplate(menuConfig)
      Menu.setApplicationMenu(menu)
    } else {
      // 无菜单 | null
      Menu.setApplicationMenu(menu) // null
    }
  }
}

//i18n功能
function changeLang() {
  ipcMain.on('changeLanguage', (event, data) => {
    lang = data
    menuData = require('./lang/' + lang + '.json')
    init()
    setMenu()
  });
}

function initMenu(mainWindow) {
  init() // 初始化菜单栏功能
  setMenu() // 加载菜单栏
  changeLang() // 触发i18n方法
  setTool(mainWindow) // 设置开发者工具

}

export default initMenu
