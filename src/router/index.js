/* eslint-disable */
import Vue from 'vue'
import { BootstrapVue, LayoutPlugin, NavPlugin, ListGroupPlugin } from 'bootstrap-vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import Page2 from '@/components/Page2'
import Page3 from '@/components/Page3'

Vue.use(NavPlugin)
Vue.use(LayoutPlugin)
Vue.use(ListGroupPlugin)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/page2',
      component: Page2
    },
    {
      path: '/page3',
      component: Page3
    }
  ]
})

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
