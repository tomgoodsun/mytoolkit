<template>
   <b-container fluid>
    <b-form>
      <b-row>
        <b-col cols="12" id="file">
          <b-form-file
            accept="image/*"
            plain
            multiple
            v-on:change="readFromFile"
          ></b-form-file>
          <div class="mt-3 images">
            <div class="result"></div>
          </div>
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

let resultArea;

export default {
  data() {
    return {
      alertMsg: '',
      file: null,
      result: null
    }
  },
  mounted: function() {
    resultArea = global.$('.result');
  },
  methods: {
    readFromFile(evt) {
      //let that = this;
      //imgElem.src = '';
      //imgElem.alt = '';
      resultArea.html('');

      let files = evt.target.files;
      console.log(typeof files);
      for (let i = 0, len = files.length; i < len; i++) {
        let file = files[i];
        let fr = new FileReader();
        fr.onload = function (evt) {
          //let img = new Image();
          //img.src = fr.result;
          //img.alt = file.name;

          let html = `<div class="img-line">`;
          html += `<div class="img-name">${file.name}</div>`;
          html += `<div class="img">`;
          html += `<img src="${fr.result}" name="${file.name}" alt="${file.name}" />`;
          html += `</div>`;
          html += `<div class="data-uri-scheme">`;
          html += `<textarea>${evt.target.result}</textarea>`;
          html += `</div>`;
          html += `</div>`;
          global.$('.result').append(html);
        };
        fr.readAsDataURL(file);
      };


      //let file = evt.target.files[0];
      //let fr = new FileReader();
      //fr.onload = function (evt) {
      //  imgElem.src = fr.result;
      //  imgElem.alt = file.name;
      //  that.result = evt.target.result;
      //};
      //fr.readAsDataURL(file);
    }
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
.images .img-line {
  clear: both;
  margin-bottom: 5px;
  overflow: hidden;
}
.images .img-line .img {
  float: left;
  height: 100px;
  width: 100px;
}
.images .img-line .img img {
  height: 99px;
  width: 99px;
}
.images .img-line .data-uri-scheme {
  float: right;
  height: 99px;
  width: calc(100% - 100px);
}
.images .img-line .data-uri-scheme textarea {
  background-color: #ccc;
  font-family: Monaco, monospace;
  height: inherit;
  width: 100%;
}
</style>
