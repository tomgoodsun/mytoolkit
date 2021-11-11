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

import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'https://tom-gs.com';
axios.defaults.headers.post['Origin'] = 'https://tom-gs.com';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Http-Remote-Host'] = 'tom-gs.com';
//const axios = require('axios');
//const axiosBase = require('axios');
//const axios = axiosBase.create({
//  baseURL: process.env.VUE_APP_HTPASSWD_API, // バックエンドB のURL:port を指定する
//  headers: {
//    'Content-Type': 'application/json',
//    'X-Requested-With': 'XMLHttpRequest'
//  },
//  responseType: 'json'
//});

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
      console.log(process.env);
      console.log(this.source);
      let sources = this.source.split('\n');
      let data = [];
      sources.forEach((line) => {
        if (0 === this.source.length) {
          return false;
        }
        let parts = line.split(':');
        if (parts.length < 2) {
          if (0 === parts[0].length) {
            return false;
          }
          parts.push(generator.generate())
        }
        data.push({
          user: parts[0],
          password: parts[1]
        });
      });

      axios.post(
        process.env.VUE_APP_HTPASSWD_API,
        data,
        {
          headers: {'Remote-Host': 'tom-gs.com'}
        },
        {
          withCredentials: true
        }
      )
      .then((response) => {
        console.log('response');
        console.log(response);
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
      })
      .finally(() => {
        console.log('finally');
        console.log(this);
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
