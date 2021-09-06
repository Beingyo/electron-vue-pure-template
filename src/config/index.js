const { build, version } = require('../../package.json')

// 获取当前环境
const env = process.env

const config = {
  version: version, // 版本号
  NODE_ENV: env.NODE_ENV,
  VUE_APP_NAME: 'electron-vue-pure',
  // appName: build.productName, // 鼠标悬停显示
  trayName: '托盘名称', // 鼠标悬停显示
  isUseTray: true, // 使用托盘
  isFlash: true, // 闪烁事件
  isClose: true, // 关闭事件
  isAutoUpdate: true, // 自动更新
  isMenu: true, // 加载自定义菜单
  isSingle: true, // 限制打开一个应用
  isdevTools: true, // 显示开发者工具
  updateUrl: build.publish[0].url // 检测更新地址
}

export default config
