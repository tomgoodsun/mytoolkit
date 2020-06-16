/* eslint-disable */
import DbInitialSqlDefine from './DbInitialSqlDefine.js';

/**
 * Database Initial SQL value management class
 */
export default class DbInitialSql {

  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * Get default hosts
   *
   * @param {bool} checkedAny
   * @return {Array.<object>}
   */
  getDefaultHosts(checkedAny = false) {
    let hosts = [];
    DbInitialSqlDefine.DEFAULT_HOSTS.forEach(function (item) {
      let disabled = false;
      if (checkedAny) {
        if ('%' != item.host) {
          disabled = true;
        }
      }
      hosts.push({
        text: item.description,
        value: item.host,
        uncheckedValue: 'unchecked-' + item.host,
        disabled: disabled
      });
    });
    return hosts;
  }

  /**
   * Get dafault selected hosts
   *
   * @return {Array.<number>}
   */
  getDefaultHostsSelected() {
    let values = [];
    DbInitialSqlDefine.DEFAULT_HOSTS.forEach(function (item) {
      if (item.selected) {
        values.push(item.host);
      }
    });
    return values;
  }

  /**
   * Get lists of charsets
   *
   * @return {Array.<object>}
   */
  getCharsets() {
    let doneList = [];
    let charsets = [];
    DbInitialSqlDefine.CHARSETS.forEach(function (item) {
      if (-1 === doneList.indexOf(item.charset)) {
        doneList.push(item.charset);
        charsets.push({
          text: item.charset,
          value: item.charset
        });
      }
    });
    return charsets;
  }

  /**
   * Get default charset
   *
   * @return {string}
   */
  getDefaultCharset() {
    return DbInitialSqlDefine.DEFAULT_CHARSET;
  }

  /**
   * Get lists of collations of specified charset
   *
   * @param {string} charset
   * @return {Array.<object>}
   */
  getCollations(charset) {
    let collations = [];
    DbInitialSqlDefine.CHARSETS.forEach(function (item) {
      if (charset == item.charset) {
        collations.push({
          text: item.collation,
          value: item.collation
        });
      }
    });
    return collations;
  }

  /**
   * Get default collation
   *
   * @return {string}
   */
  getDefaultCollation() {
    return DbInitialSqlDefine.DEFAULT_COLLATION;
  }

  /**
   * Get lists of privileges
   *
   * @return {Array.<object>}
   */
  getPrivileges() {
    let privileges = [];
    DbInitialSqlDefine.PRIVILEGES.forEach(function (item) {
      privileges.push({
        text: `${item.privilege} (${item.column})`,
        value: item.privilege
      });
    });
    return privileges;
  }

  /**
   * Get lists of default selected privileges
   *
   * @return {Array.<string>}
   */
  getPrivilegesSelected() {
    let selected = [];
    DbInitialSqlDefine.PRIVILEGES.forEach(function (item) {
      if (item.checked) {
        selected.push(item.privilege);
      }
    });
    return selected;
  }

  /**
   * Get lists of selecting all privileges
   *
   * @return {Array.<string>}
   */
  getPrivilegesSelectedAll() {
    let selected = [];
    DbInitialSqlDefine.PRIVILEGES.forEach(function (item) {
      selected.push(item.privilege);
    });
    return selected;
  }

  /**
   * Get default form values
   *
   * @return {object}
   */
  getDefaultFormValues() {
    return {
      database: '',
      username: '',
      password: '',
      useNativePassword: '1',
      customHosts: '',
      charsetsSelected: this.getDefaultCharset(),
      charsets: this.getCharsets(),
      collationsSelected: this.getDefaultCollation(),
      collations: this.getCollations(this.getDefaultCharset()),
      hostsSelected: this.getDefaultHostsSelected(),
      hosts: this.getDefaultHosts(),
      privilegesSelected: this.getPrivilegesSelected(),
      privileges: this.getPrivileges(),
    };
  }
}
