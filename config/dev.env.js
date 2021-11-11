'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  VUE_APP_HTPASSWD_API: '"//tom-gs.com/demo/mytoolkit/htpasswd.php"',
  NODE_ENV: '"development"'
})
