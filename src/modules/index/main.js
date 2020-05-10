import Vue from 'vue'
import http from '@utils/http'
import App from './app'

// import ECharts from 'vue-echarts/components/ECharts.vue'
// import 'echarts/lib/chart/line'

import mandMobile, {
  DatePicker
} from 'mand-mobile'

import 'mand-mobile/lib/mand-mobile.css'

import Vant from 'vant'
import 'vant/lib/index.css'
// Vue.component('chart', ECharts)
Vue.component(DatePicker.name, DatePicker)
Vue.use(mandMobile)

Vue.use(Vant)

Vue.use((v) => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
