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
          <div class="result">

            <div v-for="(value) in result" v-bind:key="value.name" class="img-line">
              <div class="img-name">{{ value.file.name }}</div>
              <div class="img">
                <img
                  :src="value.event.srcElement.result"
                  :name="value.file.name"
                  :alt="value.file.name"
                />
              </div>
              <div class="data-uri-scheme">
                <textarea
                  :id="value.id"
                  v-bind:value="value.event.srcElement.result"
                >
                </textarea>
              </div>
              <div class="op-btn">
                <b-button
                  variant="light"
                  size="sm"
                  class="clipboard"
                  :data-clipboard-target="value.target"
                  title="Copy to clipboard"
                >
                  <b-icon icon="clipboard" aria-hidden="true"></b-icon> Copy
                </b-button>
              </div>
            </div>

          </div>
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
import Clipboard from 'clipboard';

Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);

let resultAreas = [];
let fileCount = 0;
let frResults = [];
let frResultCount = 0;

export default {
  data() {
    return {
      result: []
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

      fileCount = files.length;
      frResults = [];
      this.result = [];
      frResultCount = 0;

      for (let i = 0; i < fileCount; i++) {
        this.loadImage(i, files[i]);
      };
      this.checkImageLoading();
    },

    loadImage(index, file) {
      let fr = new FileReader();
      fr.onload = function (evt) {
        frResults[index] = {
          index: index,
          id: 'data-uri-scheme-result-' + index,
          target: '#data-uri-scheme-result-' + index,
          file: file,
          event: evt
        };
        frResultCount++;
      };
      fr.readAsDataURL(file);
    },

    checkImageLoading() {
      console.log(frResults);
      if (fileCount == frResultCount) {
        this.result = frResults;
        new Clipboard('.clipboard');
        return;
      }
      setTimeout(this.checkImageLoading, 500);
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
.images .img-line .op-btn {
  font-size: 8px;
  margin-top: 0.5rem;
  text-align: right;
}
</style>
