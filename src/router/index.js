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
  { path: '/', component: Home },
  { path: '/ml-beautifier', component: MarkupLanguageBeautifier },
  { path: '/css-beautifier', component: CssBeautifier },
  { path: '/js-beautifier', component: JavaScriptBeautifier },
  { path: '/json-beautifier', component: JsonBeautifier },
  { path: '/sql-beautifier', component: SqlBeautifier },
  { path: '/db-initial-sql-creator', component: DbInitialSqlCreator },
  { path: '/password-generator', component: PasswordGenerator },
  { path: '/qrcode-reader', component: QrcodeReader },
  { path: '/data-uri-scheme-generator', component: DataUriSchemeGenerator },
  { path: '/htpasswd-generator', component: HtpasswdGenerator },
  { path: '/world-clock', component: WorldClock }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
