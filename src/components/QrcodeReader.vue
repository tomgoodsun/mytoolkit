<template>
  <b-container fluid>
    <b-form>
      <b-row>
        <b-col cols="6" id="file">
          <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            v-on:change="readFromFile"
          ></b-form-file>
          <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
          <div class="mt-3 image"><img src=""></div>

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
    <div class="mb-1">
      Return value: {{ String(alertMsg) }}
    </div>
  </b-container>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import {
  BFormTextarea,
  BootstrapVue,
  ButtonPlugin,
  FormFilePlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  LayoutPlugin,
  ModalPlugin
} from 'bootstrap-vue';
import {
  BrowserQRCodeReader,
  BrowserMultiFormatReader
} from '@zxing/library';

Vue.use(ButtonPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);
Vue.use(ModalPlugin);

const codeReader = new BrowserMultiFormatReader();

export default {
  data() {
    return {
      alertMsg: '',
      file: null,
      result: null
    }
  },
  methods: {
    readFromFile(evt) {
      let that = this;
      let elem = document.querySelector('#file .image img:first-child');
      //let resultForm = document.querySelector('#result');
      elem.src = '';
      elem.alt = '';

      let file = evt.target.files[0];
      let fr = new FileReader();
      fr.onload = function () {
        elem.src = fr.result;
        elem.alt = file.name;
        codeReader.decodeFromImage(elem).then((result) => {
          that.result = result.text;
          //resultForm.select();
          //console.log(resultForm);
        }).catch((err) => {
          console.error(err)
        });
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
#file .image img:first-child {
  width: 100%;
}
#result {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
