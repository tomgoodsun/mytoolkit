<template>
  <div id="app">
    <b-sidebar
     id="sidebar-no-header"
     aria-labelledby="sidebar-no-header-title"
     shadow
     backdrop
     title="tom-gs.com toolkit"
    >
      <template #default="{ hide }">
        <div class="p-3">
          <nav class="mb-3">
            <b-nav vertical>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/">HOME</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/ml-beautifier">Markup Language Beautifier</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/css-beautifier">CSS Beautifier</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/js-beautifier">JavaScript Beautifier</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/json-beautifier">JSON Beautifier</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/sql-beautifier">SQL Beautifier</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/db-initial-sql-creator">DB Initial SQL Creator</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/qrcode-reader">QR Code Reader</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/data-uri-scheme-generator">Image Data URI Scheme Generator</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/password-generator">Password Generator</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/htpasswd-generator">Htpasswd Generator</b-nav-item>
              <b-nav-item @click="navEvent" exact-active-class="active" to="/world-clock">World Clock</b-nav-item>
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>
    <header id="header" class="site-title">
      <a v-b-toggle.sidebar-no-header class="toggle-sidebar">
        <b-icon-list></b-icon-list>
      </a>
      <span class="site-name">tom-gs.com</span> toolkit - {{ contentName }}
    </header>
    <b-container class="wrapper" fluid>
      <div class="content">
        <router-view></router-view>
      </div>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { BootstrapVue, IconsPlugin, SidebarPlugin } from 'bootstrap-vue';
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(SidebarPlugin);

export default {
  name: 'App',
  data() {
    return {
      contentName: ''
    };
  },
  mounted() {
    this.contentName = document.querySelector('#sidebar-no-header a.active').innerHTML;
  },
  methods: {
    /**
     * @param {Event} evt
     */
    navEvent(evt) {
      this.contentName = evt.target.innerHTML;
    }
  }
}
</script>

<style>
@import url(//db.onlinewebfonts.com/c/034590c9705a820856d89653415479ff?family=Neutraface+2+Text+Bold);
@font-face {
  font-family: "Neutraface 2 Text Bold";
  src: url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.eot");
  src: url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.eot?#iefix") format("embedded-opentype"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.woff2") format("woff2"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.woff") format("woff"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.ttf") format("truetype"),
    url("//db.onlinewebfonts.com/t/034590c9705a820856d89653415479ff.svg#Neutraface 2 Text Bold") format("svg");
}

@import url(//db.onlinewebfonts.com/c/f6e67539e25adbf860808313c8e75ce5?family=Digital-7);
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
.b-sidebar > .b-sidebar-header {
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

#app .nav .nav-item:hover {
  background-color: #ffcc99 !important;
}
#app .nav .nav-item .active {
  background-color: var(--normal-text-color); /* Reverse of text color */
}
#app .nav .nav-item:hover a,
#app .nav .nav-item a {
  color: var(--normal-text-color) !important;
}
#app .nav .nav-item .active,
#app .nav .nav-item:hover .active {
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
.custom-select {
  background-color: #fff0 !important;
  color: #cfcfcf !important;
}
.custom-select option {
  background-color: #2c3e50 !important;
}
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #ffcc66 !important;
  background-color: #ffcc66 !important;
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
