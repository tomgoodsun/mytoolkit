<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>
        Input SQL string
      </b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="sql-from"
        v-model="$data.sqlFrom"
        placeholder="Enter SQL string..."
      ></b-form-textarea>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="sqlTo.length > 0" variant="info" show>SQL parsed</b-alert>
      <b-alert v-else variant="dark" show>Waiting for SQL input...</b-alert>
      <b-form-textarea
        id="sql-to"
        v-model="$data.sqlTo"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#sql-to"
          title="Copy to clipboard"
        >
          <b-icon icon="clipboard" aria-hidden="true"></b-icon> Copy
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { BootstrapVue, AlertPlugin, BFormTextarea, LayoutPlugin } from 'bootstrap-vue';
import { format } from 'sql-formatter';
import Clipboard from 'clipboard';

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
              parsedSql = format(sqlFrom);
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
  mounted() {
    new Clipboard('.clipboard');
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
.op-btn {
  margin-top: 0.5rem;
  text-align: right;
}
</style>
