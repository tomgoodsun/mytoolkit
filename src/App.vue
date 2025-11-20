<template>
  <div id="app">
    <BOffcanvas
      id="sidebar-no-header"
      v-model="sidebarVisible"
      title="tom-gs.com toolkit"
      shadow
      backdrop
    >
      <div class="p-3">
        <nav class="mb-3">
          <BNav vertical>
            <BNavItem
              v-for="(route, index) in routes"
              :key="index"
              @click="navEvent"
              exact-active-class="active"
              :to="route.path"
            >
              {{ route.meta.title }}
            </BNavItem>
          </BNav>
        </nav>
      </div>
    </BOffcanvas>
    <header id="header" class="site-title">
      <a @click="sidebarVisible = !sidebarVisible" class="toggle-sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </a>
      <span class="site-name">tom-gs.com</span> toolkit Ver.{{ version }} - {{ contentName }}
    </header>
    <BContainer class="wrapper" fluid>
      <div class="content">
        <router-view></router-view>
      </div>
    </BContainer>
    <footer>
    </footer>
  </div>
</template>

<script>
import { BOffcanvas, BNav, BNavItem, BContainer } from 'bootstrap-vue-next'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
    BOffcanvas,
    BNav,
    BNavItem,
    BContainer
  },
  setup() {
    const route = useRoute()
    const contentName = ref('')
    const sidebarVisible = ref(false)
    const version = import.meta.env.VITE_APP_VERSION || '0.0.0'
    const routes = useRouter().options.routes

    // ルートのメタデータからページ名を取得
    const updateContentName = () => {
      contentName.value = route.meta.title || 'HOME'
    }

    // 初期表示時にページ名を設定
    updateContentName()

    // ルート変更を監視
    watch(() => route.path, () => {
      updateContentName()
    })

    const navEvent = () => {
      // ルート変更後にwatchが自動的にcontentNameを更新するため、
      // ここではサイドバーを閉じるだけでOK
      sidebarVisible.value = false
    }

    return {
      routes,
      contentName,
      sidebarVisible,
      version,
      navEvent
    }
  }
}
</script>

<style>
@import url(//db.onlinewebfonts.com/c/034590c9705a820856d89653415479ff?family=Neutraface+2+Text+Bold);
@import url(//db.onlinewebfonts.com/c/f6e67539e25adbf860808313c8e75ce5?family=Digital-7);
@font-face {
  font-family: "Neutraface 2 Text Bold";
  src: url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.eot");
  src: url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.eot?#iefix") format("embedded-opentype"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.woff2") format("woff2"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.woff") format("woff"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.ttf") format("truetype"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.svg#Neutraface 2 Text Bold") format("svg");
}
@font-face {
  font-family: "Digital-7";
  src: url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.eot");
  src: url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.eot?#iefix") format("embedded-opentype"),
    url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.woff2") format("woff2"),
    url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.woff") format("woff"),
    url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.ttf") format("truetype"),
    url("//db.onlinewebfonts.com/t/f6e67539e25adbf860808313c8e75ce5.svg#Digital-7") format("svg");
}

:root {
  --normal-text-color: #2b2b2b;
}

html {
  background-color: #2c3e50;
}
body {
  background-color: #2c3e50;
  margin: 0;
}

#header {
  font-size: 200%;
  font-weight: bold;
  margin-bottom: 0;
  position: sticky;
  text-align: left;
  top: 0px;
  z-index: 10;
}

#header,
.offcanvas-header {
  background-color: #3399cc;
  color: #ffffff;
  font-display: swap;
  font-family: 'Neutraface 2 Text Bold';
  font-size: 1.5rem !important;
  padding: 0.5rem 1rem 0.5rem 1rem !important;
}

.site-title .site-name {
  color: #ffcc99;
}
.toggle-sidebar {
  color: #fff;
  cursor: pointer;
}
#app {
  background-color: #2c3e50;
  box-sizing: border-box;
  color: #cfcfcf;
  font-family: 'M PLUS 1p', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app .container {
  margin: 0 0 0 0;
}

#sidebar-no-header .nav .nav-item:hover {
  background-color: #ffcc99 !important;
}
#sidebar-no-header .nav .nav-item .active {
  background-color: var(--normal-text-color);
}
#sidebar-no-header .nav .nav-item:hover a,
#sidebar-no-header .nav .nav-item a {
  color: var(--normal-text-color) !important;
}
#sidebar-no-header .nav .nav-item .active,
#sidebar-no-header .nav .nav-item:hover .active {
  color: #cfcfcf !important;
}

#app .wrapper {
  box-sizing: border-box;
  margin: 0;
}
#app .content {
  max-width: 100% !important;
  padding: 10px 0 10px 0;
  width: 100% !important;
}
#app .content > .row > .col {
  margin-bottom: 1.2rem;
}

.form-control,
.form-select {
  background-color: #fff0 !important;
  color: #cfcfcf !important;
}
.form-select option {
  background-color: #2c3e50 !important;
}
.form-check-input:checked {
  background-color: #ffcc66 !important;
  border-color: #ffcc66 !important;
}
.btn-outline-primary {
  color: #ffcc66 !important;
  border-color: #ffcc66 !important;
}
.btn-outline-primary:hover,
.btn-primary,
.btn-primary:hover {
  background-color: #ffcc66 !important;
  border-color: #ffcc66 !important;
  color: #2c3e50 !important;
}
</style>
