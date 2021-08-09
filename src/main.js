import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import print from '@/plugs/print'
Vue.use(print)

new Vue({
  render: h => h(App),
}).$mount('#app')
