<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6">
        <b-alert v-if="$data.errorMessage == ''" variant="success" show>Input SQL string</b-alert>
        <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
        <b-form-textarea
          id="sql-from"
          v-model="$data.sqlFrom"
          placeholder="Enter SQL string..."
        ></b-form-textarea>
      </b-col>
      <b-col cols="6">
        <b-alert v-if="sqlTo.length > 0" variant="info" show>SQL parsed</b-alert>
        <b-alert v-else variant="dark" show>Waiting for SQL input...</b-alert>
        <b-form-textarea
          id="sql-to"
          v-model="$data.sqlTo"
          readonly
        ></b-form-textarea>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import { BootstrapVue, AlertPlugin, BFormTextarea, LayoutPlugin } from 'bootstrap-vue'
import sqlFormatter from "sql-formatter";

Vue.use(AlertPlugin);

export default {
  data() {
    return {
      'sqlFrom': '',
      'sqlTo': '',
      'errorMessage': ''
    };
  },
  created() {
    this.$watch(
      () => this.$data.sqlFrom,
      (sqlFrom) => {
        let that = this;

        // 切り替わったことをわかりやすくするため、時間差で処理する
        setTimeout(() => {
          let parsedSql = '';
          let errorMessage = '';
          try {
            if (sqlFrom.length > 0) {
              parsedSql = sqlFormatter.format(sqlFrom);
            }
          } catch (e) {
            errorMessage = 'SQL Parse Error.';
          }
          console.log(errorMessage);
          that.sqlTo = parsedSql;
          that.errorMessage = errorMessage;
        }, 500);

        this.sqlTo = '';
      }
    );
  },
  components: {
    AlertPlugin,
    BFormTextarea
  }
}
</script>

<style>
#sql-from, #sql-to {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
