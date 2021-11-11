<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>Input Markup Language string</b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="ml-from"
        v-model="$data.mlFrom"
        placeholder="Enter Markup Language string..."
      ></b-form-textarea>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="mlTo.length > 0" variant="info" show>Markup Language parsed</b-alert>
      <b-alert v-else variant="dark" show>Waiting for Markup Language input...</b-alert>
      <b-form-textarea
        id="ml-to"
        v-model="$data.mlTo"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button variant="light" size="sm" class="clipboard" data-clipboard-target="#ml-to" title="Copy to clipboard">
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
      'mlFrom': '',
      'mlTo': '',
      'errorMessage': ''
    };
  },
  created() {
    this.$watch(
      () => this.$data.mlFrom,
      (mlFrom) => {
        let that = this;

        // 切り替わったことをわかりやすくするため、時間差で処理する
        setTimeout(() => {
          let parsedMl = '';
          let errorMessage = '';
          try {
            if (mlFrom.length > 0) {
              parsedMl = beautify.html(mlFrom, {indent_size: 2, space_in_empty_paren: true});
            }
          } catch (e) {
            errorMessage = 'Markup Language Parse Error.';
          }
          console.log(errorMessage);
          that.mlTo = parsedMl;
          that.errorMessage = errorMessage;
        }, 500);

        this.mlTo = '';
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
#ml-from, #ml-to {
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
