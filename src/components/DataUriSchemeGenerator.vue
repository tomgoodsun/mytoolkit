<template>
   <b-container fluid>
    <b-form>
      <b-row>
        <b-col cols="6" id="file">
          <b-form-file
            v-model="file"
            accept="image/*"
            plain
            multiple
            v-on:change="readFromFile"
          ></b-form-file>
          <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
          <div class="mt-3 image">
            <img src="">
          </div>
        </b-col>

        <b-col cols="6">
          <b-form-textarea
            id="result"
            v-model="$data.result"
            readonly
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import {
  BFormTextarea,
  BootstrapVue,
  FormFilePlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  LayoutPlugin,
} from 'bootstrap-vue';
import {
  BrowserQRCodeReader,
  BrowserMultiFormatReader,
  BrowserCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from '@zxing/library';

Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);

const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
let imgElem;

export default {
  data() {
    return {
      alertMsg: '',
      file: null,
      result: null
    }
  },
  mounted: function() {
    imgElem = document.querySelector('#file .image img:first-child');
  },
  methods: {
    readFromFile(evt) {
      let that = this;
      imgElem.src = '';
      imgElem.alt = '';

      let file = evt.target.files[0];
      let fr = new FileReader();
      fr.onload = function (evt) {
        imgElem.src = fr.result;
        imgElem.alt = file.name;
        that.result = evt.target.result;
      };
      fr.readAsDataURL(file);
    }
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
#result {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
