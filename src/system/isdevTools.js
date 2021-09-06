function isdevTools(devToolsShow, mainWindow) {
  if (devToolsShow) {
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
    mainWindow.webContents.openDevTools({ mode: 'right' })
  } else {
    mainWindow.webContents.closeDevTools()
  }
}

export default isdevTools
