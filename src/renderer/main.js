import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'
// import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control

import api from '@/api/index' // 统一输出接口
Vue.prototype.$api = api
Vue.prototype.$wsUrl = 'ws://localhost:10202'

// Vue.http = Vue.prototype.$http = axios

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
