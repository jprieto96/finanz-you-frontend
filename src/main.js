import Vue from 'vue'
import App from './App.vue'
import router from "@/rooter";

import store from './store'
import VueCryptojs from 'vue-cryptojs'
import VueCookies from 'vue-cookies'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueCryptojs)
Vue.use(VueCookies)

new Vue({
  router,
  store,
  VueCryptojs,
  render: h => h(App),
}).$mount('#app')
