import config from '../config/index'
import initAutoUpdate from './initAutoUpdate'
import initUseTray from './initUseTray'
import initClose from './initClose'
import initMenu from './initMenu'

function initSys(app, mainWindow) {
  if (config.isAutoUpdate) {
    if (!config.updateUrl) {
      console.log('Please set updateUrl right!')
    } else {
      initAutoUpdate(app, mainWindow, config.updateUrl)
    }
  }
  if (config.isUseTray) {
    initUseTray(app, mainWindow)
  }
  if (config.isClose) {
    initClose(app, mainWindow)
  }
  if (config.isMenu) {
    initMenu(mainWindow)
  }
}

export default initSys
