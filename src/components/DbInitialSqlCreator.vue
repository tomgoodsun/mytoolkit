<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6">
        <b-form @reset="onReset" v-if="show">
          <b-form-group id="input-group-database" label="Database:" label-for="database">
            <b-form-input
              id="database"
              name="database"
              v-model="form.database"
              required
              placeholder="Enter DB name"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-username" label="User name:" label-for="username">
            <b-form-input
              id="username"
              name="username"
              v-model="form.username"
              required
              placeholder="Enter username"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-password" label="Password:" label-for="password">
            <b-form-input
              id="password"
              name="password"
              v-model="form.password"
              required
              placeholder="Enter password"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Charset Type: ">
            <b-form-select
              v-model="form.charsetGroupsSelected"
              :options="form.charsetGroups"
              @change="updateCharsets($event)"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Charset: ">
            <b-form-select
              v-model="form.charsetsSelected"
              :options="form.charsets"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Hosts: ">
            <b-form-checkbox
              v-for="defaultHost in form.defaultHosts"
              v-model="form.defaultHostsSelected"
              :key="defaultHost.value"
              :value="defaultHost.value"
              name="flavour-3a"
            >
              {{ defaultHost.text }}
            </b-form-checkbox>
          </b-form-group>

          <b-form-group id="input-group-custom-hosts" label="Custom hosts:" label-for="custom-hosts">
            <b-form-textarea
              id="custome-hosts"
              v-model="form.customHosts"
            ></b-form-textarea>
          </b-form-group>
         </b-form>
      </b-col>
      <b-col cols="6">
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {
  BootstrapVue,
  AlertPlugin,
  BFormTextarea,
  FormCheckboxPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  FormSelectPlugin,
  LayoutPlugin
} from 'bootstrap-vue'
import DbInitialSql from '../libraries/DbInitialSql.js'

Vue.use(FormCheckboxPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormPlugin)
Vue.use(FormSelectPlugin)
Vue.use(AlertPlugin);

//const HOSTS = {
//  default: [
//    { text: '%', value: '%' },
//    { text: 'localhost', value: 'localhost' },
//    { text: '127.0.0.1', value: '127.0.0.1' }
//  ],
//  selected: [
//    'localhost',
//    '127.0.0.1'
//  ]
//};


export default {
  data() {
    let dis = new DbInitialSql();
    return {
      form: {
        database: '',
        username: '',
        password: '',
        customHosts: '',
        charsetGroupsSelected: dis.getDefaultCharsetGroup(),
        charsetGroups: dis.getCharsetGroups(),
        charsetsSelected: dis.getDefaultCharset(),
        charsets: dis.getCharsets(dis.getDefaultCharsetGroup()),
        //selected: HOSTS.selected,
        //defaultHosts: HOSTS.default
        defaultHostsSelected: dis.getDefaultHostsSelected(),
        defaultHosts: dis.getDefaultHosts()
      },
      //foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      show: true
    };
  },
  //created() {
  //  this.$watch(
  //    () => this.$data.jsonFrom,
  //    (jsonFrom) => {
  //      let that = this;

  //      // 切り替わったことをわかりやすくするため、時間差で処理する
  //      setTimeout(() => {
  //        let parsedJson = '';
  //        let errorMessage = '';
  //        try {
  //          if (jsonFrom.length > 0) {
  //            parsedJson = JSON.stringify(JSON.parse(jsonFrom), null, 2);
  //          }
  //        } catch (e) {
  //          errorMessage = 'JSON Parse Error.';
  //        }
  //        console.log(errorMessage);
  //        that.jsonTo = parsedJson;
  //        that.errorMessage = errorMessage;
  //      }, 500);

  //      this.jsonTo = '';
  //    }
  //  );
  //},
  methods: {
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.database = ''
      this.form.username = ''
      this.form.food = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    /**
     * @param Event {evt}
     */
    updateCharsets(evt) {
      let dis = new DbInitialSql();
      console.log(dis.getCharsets(evt));
      console.log();
      this.form.charsets = dis.getCharsets(evt);
    }
  },
  components: {
    AlertPlugin,
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
</style>
