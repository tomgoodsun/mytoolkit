<template>
  <b-form>
    <b-row>
      <b-col col lg="12" md="12" sm="12" id="file">
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
//import Clipboard from 'clipboard';

Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);

let resultAreas = [];

async function loadImage(index, file) {
  let fr = new FileReader();
  fr.onload = function (evt) {
    console.log(file);
    let html = '';

    html += `<div class="img-line">`;
    //html += `  <div class="op-btn">`;
    //html += `    <button variant="light" size="sm" class="btn btn-sm btn-light clipboard" data-clipboard-target="#json-to" title="Copy to clipboard">`;
    //html += `      <svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="clipboard" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-clipboard b-icon bi"><g><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path></g></svg> Copy`;
    //html += `    </button>`;
    //html += `  </div>`;

    html += `  <div class="img-name">${file.name}</div>`;
    html += `  <div class="img">`;
    html += `    <img src="${fr.result}" name="${file.name}" alt="${file.name}" />`;
    html += `  </div>`;
    html += `  <div class="data-uri-scheme">`;
    html += `    <textarea id="data-uri-scheme-result-${index}">${evt.target.result}</textarea>`;
    html += `  </div>`;
    html += `</div>`;
    resultAreas.forEach(element => {
      element.innerHTML += html;
    });
  };
  await fr.readAsDataURL(file);
}

export default {
  data() {
    return {
    }
  },
  mounted() {
    resultAreas = document.querySelectorAll('.result');
  },
  methods: {
    readFromFile(evt) {
      resultAreas.forEach(element => {
        element.innerHTML = '';
      });
      let files = evt.target.files;
      for (let i = 0, len = files.length; i < len; i++) {
        loadImage(i, files[i]);
      };
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
  object-fit: contain;
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
