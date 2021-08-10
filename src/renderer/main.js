import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'
// import axios from 'axios'

import VueI18n from 'vue-i18n'
import { LgetItem } from '@utils/storage'

import '@/icons' // icon
import '@/permission' // permission control

import api from '@/api/index' // 统一输出接口
Vue.prototype.$api = api
Vue.prototype.$wsUrl = 'ws://localhost:10202'

// Vue.http = Vue.prototype.$http = axios

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Vue.use(VueI18n) // 通过插件的形式挂载，通过全局方法 Vue.use() 使用插件
const i18n = new VueI18n({
  // locale: 'zh', // 语言标识 //this.$i18n.locale // 通过切换locale的值来实现语言切换
  locale: LgetItem('lang') || 'zh_CN',
  messages: {
    'zh_CN': require('@/lang/zh_CN.json'),
    'zh_HK': require('@/lang/zh_HK.json'),
    'en': require('@/lang/en.json')
  }
})

new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
