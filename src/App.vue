<template>
  <div id="app">
    <div id="header">
      <span class="site-name">tom-gs.com</span> toolkit
    </div>
    <b-container class="wrapper" fluid>
      <b-row class="content-wrapper">
        <b-col cols="2" class="sidebar">
          <b-nav vertical class="">
            <!--リンクタグを生成します。-->
            <b-nav-item exact-active-class="active" to="/">HOME</b-nav-item>
            <b-nav-item exact-active-class="active" to="/json-beautifier">JSON Beautifier</b-nav-item>
            <b-nav-item exact-active-class="active" to="/sql-beautifier">SQL Beautifier</b-nav-item>
            <b-nav-item exact-active-class="active" to="/db-initial-sql-creator">DB Initial SQL Creator</b-nav-item>
            <b-nav-item exact-active-class="active" to="/qrcode-reader">QR Code Reader</b-nav-item>
            <b-nav-item exact-active-class="active" to="/data-uri-scheme-generator">Image Data URI Scheme Generator</b-nav-item>
            <b-nav-item exact-active-class="active" to="/password-generator">Password Generator</b-nav-item>
          </b-nav>
        </b-col>
        <b-col cols="9" class="content">
          <!--上記のリンクタグで設定したコンポーネントが表示される場所です。-->
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'App'
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

html,
body {
  height: 100%;
}

body {
  margin: 0;
}

#header {
  background-color: #3399cc;
  color: #fff;
  /*font-family: 'M PLUS 1p', 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: 'Neutraface 2 Text Bold';
  font-size: 60px;
  font-weight: bold;
  height: 110px;
  margin-bottom: 0;
  padding: 10px;
  text-align: left;
}

#header .site-name {
  color: #ffcc99;
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
  margin: 0;
}

#app .nav .nav-item:hover {
  background-color: #ffcc99 !important;
}
#app .nav .nav-item .active {
  background-color: #2b2b2b;
}
#app .nav .nav-item:hover a {
  color: #2b2b2b !important;
}
#app .nav .nav-item:hover .active,
#app .nav .nav-item a {
  color: #cfcfcf !important;
}

#app .wrapper {
  height: calc(100vh - 110px);
  box-sizing: border-box;
  margin: 0;
}
#app .sidebar {
  background-color: #333333;
  height: calc(100vh - 110px);
  padding: 0 0 0 0;
  width: 25%;
}
#app .content {
  flex: 0 0 83% !important;
  max-width: 100% !important;
  padding: 10px 0 0 0;
  width: 100% !important;
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
