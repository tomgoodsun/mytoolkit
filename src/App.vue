<template>
  <div id="app">
    <div id="header">
      <span class="site-name">tom-gs.com</span> toolkit
    </div>
    <b-container fluid>
      <b-row>
        <b-col cols="2">
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
        <b-col cols="9">
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
body {
  margin: 0;
}

#header {
  background-color: #3399cc;
  color: #fff;
  font-family: 'M PLUS 1p', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px;
  text-align: left;
}

#header .site-name {
  color: #ffcc99;
}
#app {
  color: #2c3e50;
  font-family: 'M PLUS 1p', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app .container {
  margin: 0;
}

#app .nav .nav-item:hover {
  background-color: #efefef;
}
#app .nav .nav-item .active {
  background-color: #ccc;
}

</style>
