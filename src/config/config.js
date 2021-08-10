// 获取开发环境
const env = process.env
const config = {
  loading: true,
  winSingle: true,
  devToolsShow: true,
  NODE_ENV: env.NODE_ENV,
  VUE_APP_NAME: 'electron-vue-pure'
}

// if (config.VUE_APP_ENV === 'development') {
//   config.devToolsShow = true
// } else if (config.VUE_APP_ENV === 'test') {
//   config.devToolsShow = true
// } else if (config.VUE_APP_ENV === 'production') {
//   config.devToolsShow = false
// }
if (config.NODE_ENV === 'development') {
  config.devToolsShow = true
} else if (config.NODE_ENV === 'test') {
  config.devToolsShow = true
} else if (config.NODE_ENV === 'production') {  // 生产环境禁用开发者工具 | false
  config.devToolsShow = false
}

module.exports = config
