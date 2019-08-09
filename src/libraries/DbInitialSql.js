/* eslint-disable */
export class DbInitialSqlDefine {

  static get DEFAULT_HOSTS () {
    return [
      {host: '%',         description: 'Any hosts (%)', selected: false},
      {host: 'localhost', description: 'localhost',     selected: true},
      {host: '127.0.0.1', description: '127.0.0.1',     selected: true}
    ];
  }

  static get PRIVILEGES() {
    return [
      {privilege: 'CREATE',                  column: 'Create_priv',            context: 'databases, tables, or indexes',         checked: true },
      {privilege: 'DROP',                    column: 'Drop_priv',              context: 'databases, tables, or views',           checked: true },
      {privilege: 'GRANT OPTION',            column: 'Grant_priv',             context: 'databases, tables, or stored routines', checked: false},
      {privilege: 'LOCK TABLES',             column: 'Lock_tables_priv',       context: 'databases',                             checked: true },
      {privilege: 'REFERENCES',              column: 'References_priv',        context: 'databases or tables',                   checked: false},
      {privilege: 'EVENT',                   column: 'Event_priv',             context: 'databases',                             checked: false},
      {privilege: 'ALTER',                   column: 'Alter_priv',             context: 'tables',                                checked: true },
      {privilege: 'DELETE',                  column: 'Delete_priv',            context: 'tables',                                checked: true },
      {privilege: 'INDEX',                   column: 'Index_priv',             context: 'tables',                                checked: true },
      {privilege: 'INSERT',                  column: 'Insert_priv',            context: 'tables or columns',                     checked: true },
      {privilege: 'SELECT',                  column: 'Select_priv',            context: 'tables or columns',                     checked: true },
      {privilege: 'UPDATE',                  column: 'Update_priv',            context: 'tables or columns',                     checked: true },
      {privilege: 'CREATE TEMPORARY TABLES', column: 'Create_tmp_table_priv',  context: 'tables',                                checked: false},
      {privilege: 'TRIGGER',                 column: 'Trigger_priv',           context: 'tables',                                checked: false},
      {privilege: 'CREATE VIEW',             column: 'Create_view_priv',       context: 'views',                                 checked: false},
      {privilege: 'SHOW VIEW',               column: 'Show_view_priv',         context: 'views',                                 checked: false},
      {privilege: 'ALTER ROUTINE',           column: 'Alter_routine_priv',     context: 'stored routines',                       checked: false},
      {privilege: 'CREATE ROUTINE',          column: 'Create_routine_priv',    context: 'stored routines',                       checked: false},
      {privilege: 'EXECUTE',                 column: 'Execute_priv',           context: 'stored routines',                       checked: false},
      {privilege: 'FILE',                    column: 'File_priv',              context: 'file access on server host',            checked: false},
      {privilege: 'CREATE TABLESPACE',       column: 'Create_tablespace_priv', context: 'server administration',                 checked: false},
      {privilege: 'CREATE USER',             column: 'Create_user_priv',       context: 'server administration',                 checked: false},
      {privilege: 'PROCESS',                 column: 'Process_priv',           context: 'server administration',                 checked: false},
      {privilege: 'PROXY',                   column: 'see proxies_priv table', context: 'server administration',                 checked: false},
      {privilege: 'RELOAD',                  column: 'Reload_priv',            context: 'server administration',                 checked: false},
      {privilege: 'REPLICATION CLIENT',      column: 'Repl_client_priv',       context: 'server administration',                 checked: false},
      {privilege: 'REPLICATION SLAVE',       column: 'Repl_slave_priv',        context: 'server administration',                 checked: false},
      {privilege: 'SHOW DATABASES',          column: 'Show_db_priv',           context: 'server administration',                 checked: false},
      {privilege: 'SHUTDOWN',                column: 'Shutdown_priv',          context: 'server administration',                 checked: false},
      {privilege: 'SUPER',                   column: 'Super_priv',             context: 'server administration',                 checked: false}
      //,{privilege: 'ALL [PRIVILEGES]', column: '', context: 'server administration', checked: false},
      // {privilege: 'USAGE', column: '', context: 'server administration', checked: false}
    ];
  }

  static get DEFAULT_CHARSET_GROUP() {
    return "utf8mb4";
  }

  static get DEFAULT_CHARSET() {
    return 'utf8mb4_bin';
  }

  static get CHARSETS() {
    return [
      {charset: "armscii8",  collation: "armscii8_bin"            },
      {charset: "armscii8",  collation: "armscii8_general_ci"     },
      {charset: "ascii",     collation: "ascii_bin"               },
      {charset: "ascii",     collation: "ascii_general_ci"        },
      {charset: "big5",      collation: "big5_chinese_ci"         },
      {charset: "big5",      collation: "big5_bin"                },
      {charset: "binary",    collation: "binary"                  },
      {charset: "cp1250",    collation: "cp1250_croatian_ci"      },
      {charset: "cp1250",    collation: "cp1250_czech_cs"         },
      {charset: "cp1250",    collation: "cp1250_general_ci"       },
      {charset: "cp1250",    collation: "cp1250_polish_ci"        },
      {charset: "cp1250",    collation: "cp1250_bin"              },
      {charset: "cp1251",    collation: "cp1251_bin"              },
      {charset: "cp1251",    collation: "cp1251_ukrainian_ci"     },
      {charset: "cp1251",    collation: "cp1251_bulgarian_ci"     },
      {charset: "cp1251",    collation: "cp1251_general_cs"       },
      {charset: "cp1251",    collation: "cp1251_general_ci"       },
      {charset: "cp1256",    collation: "cp1256_bin"              },
      {charset: "cp1256",    collation: "cp1256_general_ci"       },
      {charset: "cp1257",    collation: "cp1257_general_ci"       },
      {charset: "cp1257",    collation: "cp1257_bin"              },
      {charset: "cp1257",    collation: "cp1257_lithuanian_ci"    },
      {charset: "cp850",     collation: "cp850_general_ci"        },
      {charset: "cp850",     collation: "cp850_bin"               },
      {charset: "cp852",     collation: "cp852_bin"               },
      {charset: "cp852",     collation: "cp852_general_ci"        },
      {charset: "cp866",     collation: "cp866_bin"               },
      {charset: "cp866",     collation: "cp866_general_ci"        },
      {charset: "cp932",     collation: "cp932_bin"               },
      {charset: "cp932",     collation: "cp932_japanese_ci"       },
      {charset: "dec8",      collation: "dec8_bin"                },
      {charset: "dec8",      collation: "dec8_swedish_ci"         },
      {charset: "eucjpms",   collation: "eucjpms_bin"             },
      {charset: "eucjpms",   collation: "eucjpms_japanese_ci"     },
      {charset: "euckr",     collation: "euckr_bin"               },
      {charset: "euckr",     collation: "euckr_korean_ci"         },
      {charset: "gb18030",   collation: "gb18030_chinese_ci"      },
      {charset: "gb18030",   collation: "gb18030_unicode_520_ci"  },
      {charset: "gb18030",   collation: "gb18030_bin"             },
      {charset: "gb2312",    collation: "gb2312_bin"              },
      {charset: "gb2312",    collation: "gb2312_chinese_ci"       },
      {charset: "gbk",       collation: "gbk_bin"                 },
      {charset: "gbk",       collation: "gbk_chinese_ci"          },
      {charset: "geostd8",   collation: "geostd8_bin"             },
      {charset: "geostd8",   collation: "geostd8_general_ci"      },
      {charset: "greek",     collation: "greek_general_ci"        },
      {charset: "greek",     collation: "greek_bin"               },
      {charset: "hebrew",    collation: "hebrew_bin"              },
      {charset: "hebrew",    collation: "hebrew_general_ci"       },
      {charset: "hp8",       collation: "hp8_bin"                 },
      {charset: "hp8",       collation: "hp8_english_ci"          },
      {charset: "keybcs2",   collation: "keybcs2_bin"             },
      {charset: "keybcs2",   collation: "keybcs2_general_ci"      },
      {charset: "koi8r",     collation: "koi8r_bin"               },
      {charset: "koi8r",     collation: "koi8r_general_ci"        },
      {charset: "koi8u",     collation: "koi8u_bin"               },
      {charset: "koi8u",     collation: "koi8u_general_ci"        },
      {charset: "latin1",    collation: "latin1_german2_ci"       },
      {charset: "latin1",    collation: "latin1_spanish_ci"       },
      {charset: "latin1",    collation: "latin1_danish_ci"        },
      {charset: "latin1",    collation: "latin1_general_cs"       },
      {charset: "latin1",    collation: "latin1_swedish_ci"       },
      {charset: "latin1",    collation: "latin1_general_ci"       },
      {charset: "latin1",    collation: "latin1_german1_ci"       },
      {charset: "latin1",    collation: "latin1_bin"              },
      {charset: "latin2",    collation: "latin2_czech_cs"         },
      {charset: "latin2",    collation: "latin2_bin"              },
      {charset: "latin2",    collation: "latin2_croatian_ci"      },
      {charset: "latin2",    collation: "latin2_hungarian_ci"     },
      {charset: "latin2",    collation: "latin2_general_ci"       },
      {charset: "latin5",    collation: "latin5_turkish_ci"       },
      {charset: "latin5",    collation: "latin5_bin"              },
      {charset: "latin7",    collation: "latin7_estonian_cs"      },
      {charset: "latin7",    collation: "latin7_bin"              },
      {charset: "latin7",    collation: "latin7_general_cs"       },
      {charset: "latin7",    collation: "latin7_general_ci"       },
      {charset: "macce",     collation: "macce_bin"               },
      {charset: "macce",     collation: "macce_general_ci"        },
      {charset: "macroman",  collation: "macroman_general_ci"     },
      {charset: "macroman",  collation: "macroman_bin"            },
      {charset: "sjis",      collation: "sjis_bin"                },
      {charset: "sjis",      collation: "sjis_japanese_ci"        },
      {charset: "swe7",      collation: "swe7_bin"                },
      {charset: "swe7",      collation: "swe7_swedish_ci"         },
      {charset: "tis620",    collation: "tis620_bin"              },
      {charset: "tis620",    collation: "tis620_thai_ci"          },
      {charset: "ucs2",      collation: "ucs2_slovak_ci"          },
      {charset: "ucs2",      collation: "ucs2_unicode_520_ci"     },
      {charset: "ucs2",      collation: "ucs2_bin"                },
      {charset: "ucs2",      collation: "ucs2_swedish_ci"         },
      {charset: "ucs2",      collation: "ucs2_esperanto_ci"       },
      {charset: "ucs2",      collation: "ucs2_romanian_ci"        },
      {charset: "ucs2",      collation: "ucs2_lithuanian_ci"      },
      {charset: "ucs2",      collation: "ucs2_croatian_ci"        },
      {charset: "ucs2",      collation: "ucs2_general_ci"         },
      {charset: "ucs2",      collation: "ucs2_spanish_ci"         },
      {charset: "ucs2",      collation: "ucs2_persian_ci"         },
      {charset: "ucs2",      collation: "ucs2_latvian_ci"         },
      {charset: "ucs2",      collation: "ucs2_danish_ci"          },
      {charset: "ucs2",      collation: "ucs2_german2_ci"         },
      {charset: "ucs2",      collation: "ucs2_estonian_ci"        },
      {charset: "ucs2",      collation: "ucs2_roman_ci"           },
      {charset: "ucs2",      collation: "ucs2_general_mysql500_ci"},
      {charset: "ucs2",      collation: "ucs2_icelandic_ci"       },
      {charset: "ucs2",      collation: "ucs2_czech_ci"           },
      {charset: "ucs2",      collation: "ucs2_sinhala_ci"         },
      {charset: "ucs2",      collation: "ucs2_polish_ci"          },
      {charset: "ucs2",      collation: "ucs2_spanish2_ci"        },
      {charset: "ucs2",      collation: "ucs2_vietnamese_ci"      },
      {charset: "ucs2",      collation: "ucs2_unicode_ci"         },
      {charset: "ucs2",      collation: "ucs2_turkish_ci"         },
      {charset: "ucs2",      collation: "ucs2_hungarian_ci"       },
      {charset: "ucs2",      collation: "ucs2_slovenian_ci"       },
      {charset: "ujis",      collation: "ujis_japanese_ci"        },
      {charset: "ujis",      collation: "ujis_bin"                },
      {charset: "utf16",     collation: "utf16_polish_ci"         },
      {charset: "utf16",     collation: "utf16_spanish2_ci"       },
      {charset: "utf16",     collation: "utf16_vietnamese_ci"     },
      {charset: "utf16",     collation: "utf16_unicode_ci"        },
      {charset: "utf16",     collation: "utf16_turkish_ci"        },
      {charset: "utf16",     collation: "utf16_hungarian_ci"      },
      {charset: "utf16",     collation: "utf16_slovenian_ci"      },
      {charset: "utf16",     collation: "utf16_slovak_ci"         },
      {charset: "utf16",     collation: "utf16_unicode_520_ci"    },
      {charset: "utf16",     collation: "utf16_bin"               },
      {charset: "utf16",     collation: "utf16_swedish_ci"        },
      {charset: "utf16",     collation: "utf16_esperanto_ci"      },
      {charset: "utf16",     collation: "utf16_romanian_ci"       },
      {charset: "utf16",     collation: "utf16_lithuanian_ci"     },
      {charset: "utf16",     collation: "utf16_croatian_ci"       },
      {charset: "utf16",     collation: "utf16_general_ci"        },
      {charset: "utf16",     collation: "utf16_spanish_ci"        },
      {charset: "utf16",     collation: "utf16_persian_ci"        },
      {charset: "utf16",     collation: "utf16_latvian_ci"        },
      {charset: "utf16",     collation: "utf16_danish_ci"         },
      {charset: "utf16",     collation: "utf16_german2_ci"        },
      {charset: "utf16",     collation: "utf16_estonian_ci"       },
      {charset: "utf16",     collation: "utf16_roman_ci"          },
      {charset: "utf16",     collation: "utf16_icelandic_ci"      },
      {charset: "utf16",     collation: "utf16_czech_ci"          },
      {charset: "utf16",     collation: "utf16_sinhala_ci"        },
      {charset: "utf16le",   collation: "utf16le_bin"             },
      {charset: "utf16le",   collation: "utf16le_general_ci"      },
      {charset: "utf32",     collation: "utf32_slovenian_ci"      },
      {charset: "utf32",     collation: "utf32_slovak_ci"         },
      {charset: "utf32",     collation: "utf32_unicode_520_ci"    },
      {charset: "utf32",     collation: "utf32_bin"               },
      {charset: "utf32",     collation: "utf32_swedish_ci"        },
      {charset: "utf32",     collation: "utf32_esperanto_ci"      },
      {charset: "utf32",     collation: "utf32_romanian_ci"       },
      {charset: "utf32",     collation: "utf32_lithuanian_ci"     },
      {charset: "utf32",     collation: "utf32_croatian_ci"       },
      {charset: "utf32",     collation: "utf32_general_ci"        },
      {charset: "utf32",     collation: "utf32_spanish_ci"        },
      {charset: "utf32",     collation: "utf32_persian_ci"        },
      {charset: "utf32",     collation: "utf32_latvian_ci"        },
      {charset: "utf32",     collation: "utf32_danish_ci"         },
      {charset: "utf32",     collation: "utf32_german2_ci"        },
      {charset: "utf32",     collation: "utf32_estonian_ci"       },
      {charset: "utf32",     collation: "utf32_roman_ci"          },
      {charset: "utf32",     collation: "utf32_icelandic_ci"      },
      {charset: "utf32",     collation: "utf32_czech_ci"          },
      {charset: "utf32",     collation: "utf32_sinhala_ci"        },
      {charset: "utf32",     collation: "utf32_polish_ci"         },
      {charset: "utf32",     collation: "utf32_spanish2_ci"       },
      {charset: "utf32",     collation: "utf32_vietnamese_ci"     },
      {charset: "utf32",     collation: "utf32_unicode_ci"        },
      {charset: "utf32",     collation: "utf32_turkish_ci"        },
      {charset: "utf32",     collation: "utf32_hungarian_ci"      },
      {charset: "utf8",      collation: "utf8_swedish_ci"         },
      {charset: "utf8",      collation: "utf8_esperanto_ci"       },
      {charset: "utf8",      collation: "utf8_romanian_ci"        },
      {charset: "utf8",      collation: "utf8_lithuanian_ci"      },
      {charset: "utf8",      collation: "utf8_croatian_ci"        },
      {charset: "utf8",      collation: "utf8_general_ci"         },
      {charset: "utf8",      collation: "utf8_spanish_ci"         },
      {charset: "utf8",      collation: "utf8_persian_ci"         },
      {charset: "utf8",      collation: "utf8_latvian_ci"         },
      {charset: "utf8",      collation: "utf8_danish_ci"          },
      {charset: "utf8",      collation: "utf8_german2_ci"         },
      {charset: "utf8",      collation: "utf8_estonian_ci"        },
      {charset: "utf8",      collation: "utf8_roman_ci"           },
      {charset: "utf8",      collation: "utf8_general_mysql500_ci"},
      {charset: "utf8",      collation: "utf8_icelandic_ci"       },
      {charset: "utf8",      collation: "utf8_czech_ci"           },
      {charset: "utf8",      collation: "utf8_sinhala_ci"         },
      {charset: "utf8",      collation: "utf8_polish_ci"          },
      {charset: "utf8",      collation: "utf8_spanish2_ci"        },
      {charset: "utf8",      collation: "utf8_vietnamese_ci"      },
      {charset: "utf8",      collation: "utf8_unicode_ci"         },
      {charset: "utf8",      collation: "utf8_turkish_ci"         },
      {charset: "utf8",      collation: "utf8_hungarian_ci"       },
      {charset: "utf8",      collation: "utf8_slovenian_ci"       },
      {charset: "utf8",      collation: "utf8_slovak_ci"          },
      {charset: "utf8",      collation: "utf8_unicode_520_ci"     },
      {charset: "utf8",      collation: "utf8_bin"                },
      {charset: "utf8mb4",   collation: "utf8mb4_slovenian_ci"    },
      {charset: "utf8mb4",   collation: "utf8mb4_slovak_ci"       },
      {charset: "utf8mb4",   collation: "utf8mb4_unicode_520_ci"  },
      {charset: "utf8mb4",   collation: "utf8mb4_bin"             },
      {charset: "utf8mb4",   collation: "utf8mb4_swedish_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_esperanto_ci"    },
      {charset: "utf8mb4",   collation: "utf8mb4_romanian_ci"     },
      {charset: "utf8mb4",   collation: "utf8mb4_lithuanian_ci"   },
      {charset: "utf8mb4",   collation: "utf8mb4_croatian_ci"     },
      {charset: "utf8mb4",   collation: "utf8mb4_general_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_spanish_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_persian_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_latvian_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_danish_ci"       },
      {charset: "utf8mb4",   collation: "utf8mb4_german2_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_estonian_ci"     },
      {charset: "utf8mb4",   collation: "utf8mb4_roman_ci"        },
      {charset: "utf8mb4",   collation: "utf8mb4_icelandic_ci"    },
      {charset: "utf8mb4",   collation: "utf8mb4_czech_ci"        },
      {charset: "utf8mb4",   collation: "utf8mb4_sinhala_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_polish_ci"       },
      {charset: "utf8mb4",   collation: "utf8mb4_spanish2_ci"     },
      {charset: "utf8mb4",   collation: "utf8mb4_vietnamese_ci"   },
      {charset: "utf8mb4",   collation: "utf8mb4_unicode_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_turkish_ci"      },
      {charset: "utf8mb4",   collation: "utf8mb4_hungarian_ci"    }
    ];
  }
};

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

  getCharsetGroups() {
    let doneList = [];
    let groups = [];
    DbInitialSqlDefine.CHARSETS.forEach(function (item) {
      if (-1 === doneList.indexOf(item.charset)) {
        doneList.push(item.charset);
        groups.push({
          text: item.charset,
          value: item.charset
        });
      }
    });
    return groups;
  }

  getDefaultCharsetGroup() {
    return DbInitialSqlDefine.DEFAULT_CHARSET_GROUP;
  }

  getCharsets(group) {
    console.log(group);
    let charsets = [];
    DbInitialSqlDefine.CHARSETS.forEach(function (item) {
      if (group == item.charset) {
        charsets.push({
          text: item.collation,
          value: item.collation
        });
      }
    });
    return charsets;
  }

  getDefaultCharset() {
    return DbInitialSqlDefine.DEFAULT_CHARSET;
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
