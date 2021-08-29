<template>
  <b-container fluid>
    <b-form @reset="onReset" v-if="show">
      <b-row>
        <b-col cols="6">
          <b-form-group id="input-group-database" label="Database:" label-for="database">
            <b-form-input
              id="database"
              name="database"
              v-model="form.database"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-username" label="User name:" label-for="username">
            <b-form-input
              id="username"
              name="username"
              v-model="form.username"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-password" label="Password:" label-for="password">
            <b-form-input
              id="password"
              name="password"
              v-model="form.password"
              required
            ></b-form-input>
            <b-form-checkbox
              v-model="form.useNativePassword"
              name="useNativePassword"
              value="1"
              unchecked-value="0"
            >
              Use native password
            </b-form-checkbox>
          </b-form-group>

          <b-form-group label="Charset: ">
            <b-form-select
              v-model="form.charsetsSelected"
              :options="form.charsets"
              true-value="yes"
              false-value="no"
              @change="updateCharsets($event)"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Collation: ">
            <b-form-select
              v-model="form.collationsSelected"
              :options="form.collations"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Hosts: ">
            <b-form-checkbox
              v-for="defaultHost in form.hosts"
              v-model="form.hostsSelected"
              :key="defaultHost.value"
              :value="defaultHost.value"
              :disabled="defaultHost.disabled"
              :unchecked-value="defaultHost.uncheckedValue"
              name="hosts"
              @change="updateHostCheckbox($event)"
            >
              {{ defaultHost.text }}
            </b-form-checkbox>
          </b-form-group>

          <b-form-group id="input-group-custom-hosts" label="Custom hosts:" label-for="custom-hosts">
            <b-form-textarea
              id="custom-hosts"
              v-model="form.customHosts"
            ></b-form-textarea>
          </b-form-group>

          <b-button variant="outline-primary" name="generate" @click="generate()">Generate</b-button>

          <b-modal ref="result-sql" id="result-sql-modal" size="lg" title="Generated Result">
            <b-form-textarea readonly v-model="resultSql" id="result-sql" size="sm" rows="10"></b-form-textarea>
          </b-modal>

        </b-col>

        <b-col cols="6">

          <b-form-group label="Privileges: " id="privileges">
            <div class="buttons">
              <b-button variant="outline-primary" name="resetPrivileges" v-on:click="resetPrivileges()">Reset</b-button>
              <b-button variant="outline-primary" name="checkAllPrivileges" v-on:click="checkAllPrivileges()">Check All</b-button>
              <b-button variant="outline-primary" name="uncheckAllPrivileges" v-on:click="uncheckAllPrivileges()">Uncheck All</b-button>
            </div>
            <b-form-checkbox
              v-for="privilege in form.privileges"
              v-model="form.privilegesSelected"
              :key="privilege.value"
              :value="privilege.value"
              name="privileges"
            >
              {{ privilege.text }}
            </b-form-checkbox>
          </b-form-group>

        </b-col>

      </b-row>
    </b-form>
    <!--
    <div class="mb-1">
      Return value: {{ String(alertMsg) }}
    </div>
    -->
  </b-container>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import {
  BFormTextarea,
  BootstrapVue,
  ButtonPlugin,
  FormCheckboxPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  FormSelectPlugin,
  LayoutPlugin,
  ModalPlugin
} from 'bootstrap-vue';
import DbInitialSql from '../libraries/DbInitialSql.js';
import DbInitialSqlGenerator from '../libraries/DbInitialSqlGenerator.js';

Vue.use(ButtonPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);
Vue.use(FormSelectPlugin);
Vue.use(ModalPlugin);

export default {
  data() {
    let dis = new DbInitialSql();
    return {
      form: dis.getDefaultFormValues(),
      alertMsg: '',
      resultSql: '',
      show: true
    };
  },
  methods: {
    onReset(evt) {
      let dis = new DbInitialSql();
      evt.preventDefault();
      // Reset our form values
      this.form = dis.getDefaultFormValues(),
      this.alertMsg = '';
      this.resultSql = '';
      this.show = false;
      this.$nextTick(() => {
        this.show = true
      })
    },

    updateHostCheckbox(evt) {
      let dis = new DbInitialSql();
      this.form.hosts = dis.getDefaultHosts(evt.includes('%'));
    },

    updateCharsets(evt) {
      let dis = new DbInitialSql();
      this.form.collations = dis.getCollations(evt);
    },

    resetPrivileges() {
      let dis = new DbInitialSql();
      this.form.privilegesSelected = dis.getPrivilegesSelected();
    },
    checkAllPrivileges() {
      let dis = new DbInitialSql();
      this.form.privilegesSelected = dis.getPrivilegesSelectedAll();
    },
    uncheckAllPrivileges() {
      this.form.privilegesSelected = [];
    },

    resetModal() {
      this.reusltSql = null;
    },
    generate() {
      let generator = new DbInitialSqlGenerator(this.form);
      let sql = generator.generate();
      if (0 == sql.length) {
        let alertMsg = 'SQL could not be created due to lack of parameters.';
        //alert(alertMsg);
        this.alertMsg = ''
        this.$bvModal.msgBoxOk(alertMsg, {
          title: 'Error',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        }).then(value => {
          this.alertMsg = value;
        }).catch(err => {
          // An error occurred
        });
        return;
      }
      this.resultSql = sql;
      this.$refs['result-sql'].show();
      return;
    }
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
#json-from, #json-to {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
#result-sql {
  color: var(--normal-text-color) !important;
  font-family: Monaco, monospace;
}
#privileges .buttons button {
  margin-bottom: 5px;
}
</style>
