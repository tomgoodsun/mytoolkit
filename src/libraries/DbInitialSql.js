/* eslint-disable */
import DbInitialSqlDefine from './DbInitialSqlDefine';

export default class DbInitialSql {

  constructor() {
  }

  getDefaultHosts() {
    let hosts = [];
    DbInitialSqlDefine.DEFAULT_HOSTS.forEach(function (item) {
      hosts.push({
        text: item.description,
        value: item.host
      });
    });
    return hosts;
  }

  getDefaultHostsSelected() {
    let values = [];
    DbInitialSqlDefine.DEFAULT_HOSTS.forEach(function (item) {
      if (item.selected) {
        values.push(item.host);
      }
    });
    return values;
  }

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

  getDefaultCharset() {
    return DbInitialSqlDefine.DEFAULT_CHARSET;
  }

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

  getDefaultCollation() {
    return DbInitialSqlDefine.DEFAULT_COLLATION;
  }

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

  getPrivilegesSelected() {
    let selected = [];
    DbInitialSqlDefine.PRIVILEGES.forEach(function (item) {
      if (item.checked) {
        selected.push(item.privilege);
      }
    });
    return selected;
  }

  getPrivilegesSelectedAll() {
    let selected = [];
    DbInitialSqlDefine.PRIVILEGES.forEach(function (item) {
      selected.push(item.privilege);
    });
    return selected;
  }
}
