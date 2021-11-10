<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>Input JavaScript string</b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="js-from"
        v-model="$data.jsFrom"
        placeholder="Enter JavaScript string..."
      ></b-form-textarea>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="jsTo.length > 0" variant="info" show>JavaScript parsed</b-alert>
      <b-alert v-else variant="dark" show>Waiting for JavaScript input...</b-alert>
      <b-form-textarea
        id="js-to"
        v-model="$data.jsTo"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button variant="light" size="sm" class="clipboard" data-clipboard-target="#js-to" title="Copy to clipboard">
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
import beautify from 'js-beautify';
import Clipboard from 'clipboard';

Vue.use(AlertPlugin);

export default {
  data() {
    return {
      'jsFrom': '',
      'jsTo': '',
      'errorMessage': ''
    };
  },
  created() {
    this.$watch(
      () => this.$data.jsFrom,
      (jsFrom) => {
        let that = this;

        // 切り替わったことをわかりやすくするため、時間差で処理する
        setTimeout(() => {
          let parsedJs = '';
          let errorMessage = '';
          try {
            if (jsFrom.length > 0) {
              parsedJs = beautify.js(jsFrom, {indent_size: 2, space_in_empty_paren: true});
            }
          } catch (e) {
            errorMessage = 'JavaScript Parse Error.';
          }
          console.log(errorMessage);
          that.jsTo = parsedJs;
          that.errorMessage = errorMessage;
        }, 500);

        this.jsTo = '';
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
#js-from, #js-to {
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
