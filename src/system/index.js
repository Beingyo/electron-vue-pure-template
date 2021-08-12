import config from '../config/index'
import initAutoUpdate from './initAutoUpdate'
import initUseTray from './initUseTray'
import initClose from './initClose'
import initMenu from './initMenu'
import initStart from './initStart'

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
    initMenu(mainWindow)
  }
  if (config.isStart) {
    initStart(app, mainWindow)
  }
}

export default initSys
