<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>
        Input user:password lines. Automatically generates if no password.
      </b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="htpasswd-source"
        v-model="$data.source"
        placeholder="user:password"
      ></b-form-textarea>
      <div class="op-btn">
        <b-button
          variant="light"
          size="sm"
          class="generate"
          title="Generate"
          @click="generate()"
        >
          <b-icon icon="arrow-right-square-fill" aria-hidden="true"></b-icon> Generate
        </b-button>
      </div>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="result.length > 0" variant="info" show>Result</b-alert>
      <b-alert v-else variant="dark" show>Htpasswd result is the below.</b-alert>
      <b-form-textarea
        id="htpasswd-result"
        v-model="$data.result"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#htpasswd-result"
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

var generator = require('generate-password');

Vue.use(AlertPlugin);

export default {
  data() {
    return {
      'source': '',
      'result': '',
      'errorMessage': ''
    };
  },
  mounted() {
    new Clipboard('.clipboard');
  },
  methods: {
    generate() {
      let source = this.source;
      let data = new URLSearchParams();
      if (0 === source.length) {
        return false;
      }
      source.split('\n').forEach((line, index) => {
        let parts = line.split(':');
        if (parts.length < 2) {
          if (0 === parts[0].length) {
            return false;
          }
          parts.push(generator.generate())
        }
        data.append(`data[${index}][user]`, parts[0]);
        data.append(`data[${index}][password]`, parts[1]);
      });

      var request = new Request(process.env.VUE_APP_HTPASSWD_API,{
        method: 'post',
        //headers: {'Remote-Host': 'tom-gs.com'},
        body: data
      });
      fetch(request)
        .then((response) => {
          console.log(response);
          if (response.ok) {
            response.json().then(json => {
              this.result = json.join('\n');
            });
          }
        });
    }
  },
  components: {
    AlertPlugin,
    BFormTextarea
  }
}
</script>

<style>
#htpasswd-result, #htpasswd-source {
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
