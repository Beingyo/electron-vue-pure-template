const { build, version } = require('../../package.json')

const config = {
  version: version, // 版本号
  // appName: build.productName, // 鼠标悬停显示
  appName: '托盘名称', // 鼠标悬停显示
  isUseTray: true, // 使用托盘
  isClose: true, // 关闭事件
  isAutoUpdate: true, // 自动更新
  isMenu: true, // 菜单内容自定义
  updateUrl: build.publish[0].url // 检测更新地址
}

export default config
