// 获取开发环境（未实现）
const env = process.env
console.log('当前环境：' + process.env.NODE_ENV)
const config = {
  loading: true,
  winSingle: true,
  devToolsShow: true,
  VUE_APP_ENV: env.VUE_APP_ENV,
  NODE_ENV: env.NODE_ENV,
  VUE_APP_APPID: env.VUE_APP_APPID,
  VUE_APP_VERSION: env.VUE_APP_VERSION
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
