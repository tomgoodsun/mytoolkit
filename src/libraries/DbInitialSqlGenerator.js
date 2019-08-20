/* eslint-disable */
import DbInitialSqlDefine from './DbInitialSqlDefine.js';

var sprintf = require('sprintf-js').sprintf;

/**
 * Database Initial SQL statement generating class
 */
export default class DbInitialSqlGenerator {

  /**
   * @type {object}
   */
  form;

  /**
   * @constructor
   * @param {object} form
   */
  constructor(form) {
    this.form = form;
  }

  /**
   * Get lists of checked or written hostnames
   *
   * @return {Array.<string>}
   */
  getHosts() {
    let hosts = this.form.hostsSelected;
    let customHosts = this.form.customHosts.split('\n');
    for (let i = 0, len = customHosts.length; i < len; i++) {
      if (customHosts[i].length > 0 && -1 == hosts.indexOf(customHosts[i])) {
        hosts.push(customHosts[i]);
      }
    }
    return hosts;
  }

  /**
   * Get lists of checked privileges
   *
   * @return {Array.<string>}
   */
  getPrivs() {
    let privs = this.form.privilegesSelected;
    if (privs.length === DbInitialSqlDefine.PRIVILEGES.length) {
      return ['ALL PRIVILEGES'];
    }
    return privs;
  }

  /**
   * Generate initializing SQL for MySQL
   *
   * @return {string}
   */mytoolkimytoolkitt
  generate() {
    let result = [];
    let tmpResult = [];
    tmpResult = tmpResult.concat(this.generateCreateDatabase());
    tmpResult = tmpResult.concat(this.generateCreateUser());
    tmpResult = tmpResult.concat(this.generateGrant());
    for (let i = 0, len = tmpResult.length; i < len; i++) {
      if (tmpResult[i].length > 0) {
        result.push(tmpResult[i]);
      }
    }
    return result.join('\n');
  }

  /**
   * Generate CREATE DATABASE statement
   *
   * @return {string}
   */
  generateCreateDatabase() {
    let ret = '';
    if (this.form.database.length > 0) {
      ret = sprintf(
        'CREATE DATABASE `%s` CHARACTER SET %s COLLATE %s;',
        this.form.database,
        this.form.charsetsSelected,
        this.form.collationsSelected
      );
    }
    return ret;
  }

  /**
   * Generate CREATE USER statements
   *
   * @return {Array.<string>}
   */
  generateCreateUser() {
    let result = [];
    let hosts = this.getHosts();
    let option = '';
    if ('1' == this.form.useNativePassword) {
      option = 'WITH mysql_native_password';
    }
    if (this.form.username.length > 0
      && this.form.password.length > 0
      && hosts.length > 0
    ) {
      for (let i = 0, len = hosts.length; i < len; i++) {
        result.push(sprintf(
          "CREATE USER '%s'@'%s' IDENTIFIED %s BY '%s';",
          this.form.username,
          hosts[i],
          option,
          this.form.password
        ));
      }
    }
    return result;
  }

  /**
   * Generate GRANT statements
   *
   * @return {Array.<string>}
   */
  generateGrant() {
    let result = [],
      priv = this.getPrivs().join(', ');
    let hosts = this.getHosts();
    if (this.form.database.length > 0
      && this.form.username.length > 0
      && hosts.length > 0
    ) {
      for (let i = 0, len = hosts.length; i < len; i++) {
        result.push(sprintf(
          "GRANT %s ON `%s`.* TO '%s'@'%s';",
          priv,
          this.form.database,
          this.form.username,
          hosts[i]
        ));
      }
    }
    return result;
  }
}
