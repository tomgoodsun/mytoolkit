'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  VUE_APP_HTPASSWD_API: '"//centos7.tom-gs.com/mytoolkit/htpasswd.php"',
  NODE_ENV: '"development"'
})
