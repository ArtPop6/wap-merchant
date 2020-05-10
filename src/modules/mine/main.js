import Vue from 'vue'
import http from '@utils/http'
import App from './app'
import { Icon } from 'vant'
import 'vant/lib/index.css'

Vue.use((v) => {
  v.prototype.$http = http
}).use(Icon)

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
