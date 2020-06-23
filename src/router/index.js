/* eslint-disable */
import Vue from 'vue'
import { BootstrapVue, LayoutPlugin, NavPlugin } from 'bootstrap-vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import DbInitialSqlCreator from '@/components/DbInitialSqlCreator'
import JsonBeautifier from '@/components/JsonBeautifier'
import SqlBeautifier from '@/components/SqlBeautifier'
import PasswordGenerator from '@/components/PasswordGenerator'
import QrcodeReader from '@/components/QrcodeReader'
import DataUriSchemeGenerator from '@/components/DataUriSchemeGenerator'

Vue.use(LayoutPlugin)
Vue.use(NavPlugin)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/json-beautifier',
      component: JsonBeautifier
    },
    {
      path: '/sql-beautifier',
      component: SqlBeautifier
    },
    {
      path: '/db-initial-sql-creator',
      component: DbInitialSqlCreator
    },
    {
      path: '/password-generator',
      component: PasswordGenerator
    },
    {
      path: '/qrcode-reader',
      component: QrcodeReader
    },
    {
      path: '/data-uri-scheme-generator',
      component: DataUriSchemeGenerator
    }
  ]
})

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
