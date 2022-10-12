// 限制只可以打开一个应用
function initSingle(app, mainWindow) {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
        mainWindow.show()
      }
    })
    // 创建 myWindow, 加载应用的其余部分, etc...
    // app.on('ready', () => {
    // })
  }
}

export default initSingle
