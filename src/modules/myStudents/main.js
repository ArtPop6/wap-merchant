import Vue from 'vue'
import http from '@utils/http'
import App from './app'
import { Icon } from 'vant'
import 'vant/lib/index.css'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard).use(Icon)

Vue.use((v) => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
