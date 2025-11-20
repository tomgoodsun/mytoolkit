import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import DbInitialSqlCreator from '@/components/DbInitialSqlCreator.vue'
import MarkupLanguageBeautifier from '@/components/MarkupLanguageBeautifier.vue'
import CssBeautifier from '@/components/CssBeautifier.vue'
import JavaScriptBeautifier from '@/components/JavaScriptBeautifier.vue'
import JsonBeautifier from '@/components/JsonBeautifier.vue'
import SqlBeautifier from '@/components/SqlBeautifier.vue'
import PasswordGenerator from '@/components/PasswordGenerator.vue'
import QrcodeReader from '@/components/QrcodeReader.vue'
import DataUriSchemeGenerator from '@/components/DataUriSchemeGenerator.vue'
import HtpasswdGenerator from '@/components/HtpasswdGenerator.vue'
import WorldClock from '@/components/WorldClock.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'HOME' } },
  { path: '/ml-beautifier', component: MarkupLanguageBeautifier, meta: { title: 'Markup Language Beautifier' } },
  { path: '/css-beautifier', component: CssBeautifier, meta: { title: 'CSS Beautifier' } },
  { path: '/js-beautifier', component: JavaScriptBeautifier, meta: { title: 'JavaScript Beautifier' } },
  { path: '/json-beautifier', component: JsonBeautifier, meta: { title: 'JSON Beautifier' } },
  { path: '/sql-beautifier', component: SqlBeautifier, meta: { title: 'SQL Beautifier' } },
  { path: '/db-initial-sql-creator', component: DbInitialSqlCreator, meta: { title: 'DB Initial SQL Creator' } },
  { path: '/password-generator', component: PasswordGenerator, meta: { title: 'Password Generator' } },
  { path: '/qrcode-reader', component: QrcodeReader, meta: { title: 'QR Code Reader' } },
  { path: '/data-uri-scheme-generator', component: DataUriSchemeGenerator, meta: { title: 'Image Data URI Scheme Generator' } },
  { path: '/htpasswd-generator', component: HtpasswdGenerator, meta: { title: 'Htpasswd Generator' } },
  { path: '/world-clock', component: WorldClock, meta: { title: 'World Clock' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
