<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6">
        <b-alert v-if="$data.errorMessage == ''" variant="success" show>Input JSON string</b-alert>
        <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
        <b-form-textarea
          id="json-from"
          v-model="$data.jsonFrom"
          placeholder="Enter JSON string..."
        ></b-form-textarea>
      </b-col>
      <b-col cols="6">
        <b-alert v-if="jsonTo.length > 0" variant="info" show>JSON parsed</b-alert>
        <b-alert v-else variant="dark" show>Waiting for JSON input...</b-alert>
        <b-form-textarea
          id="json-to"
          v-model="$data.jsonTo"
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

Vue.use(AlertPlugin);

export default {
  data() {
    return {
      'jsonFrom': '',
      'jsonTo': '',
      'errorMessage': ''
    };
  },
  created() {
    this.$watch(
      () => this.$data.jsonFrom,
      (jsonFrom) => {
        let that = this;

        // 切り替わったことをわかりやすくするため、時間差で処理する
        setTimeout(() => {
          let parsedJson = '';
          let errorMessage = '';
          try {
            if (jsonFrom.length > 0) {
              parsedJson = JSON.stringify(JSON.parse(jsonFrom), null, 2);
            }
          } catch (e) {
            errorMessage = 'JSON Parse Error.';
          }
          console.log(errorMessage);
          that.jsonTo = parsedJson;
          that.errorMessage = errorMessage;
        }, 500);

        this.jsonTo = '';
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
#json-from, #json-to {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
