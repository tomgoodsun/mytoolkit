<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="$data.errorMessage == ''" variant="success" show>
        Input CSS string
      </b-alert>
      <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>
      <b-form-textarea
        id="css-from"
        v-model="$data.cssFrom"
        placeholder="Enter CSS string..."
      ></b-form-textarea>
    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <b-alert v-if="cssTo.length > 0" variant="info" show>CSS parsed</b-alert>
      <b-alert v-else variant="dark" show>Waiting for CSS input...</b-alert>
      <b-form-textarea
        id="css-to"
        v-model="$data.cssTo"
        readonly
      ></b-form-textarea>
      <div class="op-btn">
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#css-to"
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
import beautify from 'js-beautify';
import Clipboard from 'clipboard';

Vue.use(AlertPlugin);

export default {
  data() {
    return {
      'cssFrom': '',
      'cssTo': '',
      'errorMessage': ''
    };
  },
  created() {
    this.$watch(
      () => this.$data.cssFrom,
      (cssFrom) => {
        let that = this;

        // 切り替わったことをわかりやすくするため、時間差で処理する
        setTimeout(() => {
          let parsedCss = '';
          let errorMessage = '';
          try {
            if (cssFrom.length > 0) {
              parsedCss = beautify.css(cssFrom, {indent_size: 2, space_in_empty_paren: true});
            }
          } catch (e) {
            errorMessage = 'CSS Parse Error.';
          }
          console.log(errorMessage);
          that.cssTo = parsedCss;
          that.errorMessage = errorMessage;
        }, 500);

        this.cssTo = '';
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
#css-from, #css-to {
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
