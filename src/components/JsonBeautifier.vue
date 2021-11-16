<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>
        Input JSON string
      </b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="json-from"
        v-model="$data.jsonFrom"
        placeholder="Enter JSON string..."
      ></b-form-textarea>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="jsonTo.length > 0" variant="info" show>JSON parsed</b-alert>
      <b-alert v-else variant="dark" show>Waiting for JSON input...</b-alert>
      <b-form-textarea
        id="json-to"
        v-model="$data.jsonTo"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#json-to"
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
import Clipboard from 'clipboard';

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
#json-from, #json-to {
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
