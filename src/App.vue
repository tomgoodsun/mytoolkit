<template>
  <div id="app">
    <div id="header">
      <span class="site-name">tom-gs.com</span> toolkit
    </div>
    <b-container class="wrapper" fluid>
      <b-row>
        <b-col cols="2" class="sidebar">
          <b-nav vertical class="">
            <!--リンクタグを生成します。-->
            <b-nav-item exact-active-class="active" to="/">HOME</b-nav-item>
            <b-nav-item exact-active-class="active" to="/json-beautifier">JSON Beautifier</b-nav-item>
            <b-nav-item exact-active-class="active" to="/sql-beautifier">SQL Beautifier</b-nav-item>
            <b-nav-item exact-active-class="active" to="/db-initial-sql-creator">DB Initial SQL Creator</b-nav-item>
            <b-nav-item exact-active-class="active" to="/page4">Barcode Reader</b-nav-item>
            <b-nav-item exact-active-class="active" to="/page5">Image Data URI Scheme Generator</b-nav-item>
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
html,
body {
  height: 100%;
}

body {
  background-color: #2c3e50;
  margin: 0;
}

#header {
  background-color: #3399cc;
  color: #fff;
  font-family: 'M PLUS 1p', 'Avenir', Helvetica, Arial, sans-serif;
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
  color: #cfcfcf;
}

</style>
