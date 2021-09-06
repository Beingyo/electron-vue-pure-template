import { Menu } from 'electron'
import config from '../config/index'
import initAutoUpdate from './initAutoUpdate'
import initUseTray from './initUseTray'
import initClose from './initClose'
import initMenu from './initMenu'
import initSingle from './initSingle'
import isdevTools from './isdevTools'

function initSys(app, mainWindow) {
  if (config.isAutoUpdate) {
    if (!config.updateUrl) {
      console.log('请设置正确的更新地址!')
    } else {
      initAutoUpdate(app, mainWindow, config.updateUrl)
    }
  }
  if (config.isUseTray) {
    initUseTray(app, mainWindow, config.isFlash)
  }
  if (config.isClose) {
    initClose(app, mainWindow)
  }
  if (config.isMenu) {
    initMenu()
  } else {
    Menu.setApplicationMenu(null)
  }
  if (config.isSingle) {
    initSingle(app, mainWindow)
  }
  isdevTools(config.isdevTools, mainWindow)
}

export default initSys
