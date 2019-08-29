<template>
  <b-container fluid>
    <b-form>
      <b-row>
        <b-col cols="6" id="file">
          <b-form-file
            v-model="file"
            accept="image/*"
            plain
            capture
            v-on:change="readFromFile"
          ></b-form-file>
          <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
          <div class="mt-3 image">
            <img src="">
          </div>
          <div class="mt-3 image">
            <video id="video" width="300" height="200" style="border: 1px solid gray"></video>
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
  ButtonPlugin,
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

Vue.use(ButtonPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);

const codeReader = new BrowserMultiFormatReader();
const codeReaderCamera = new BrowserCodeReader();
let selectedDeviceId;

export default {
  data() {
    return {
      alertMsg: '',
      file: null,
      result: null
    }
  },
  //mounted() {
  //  codeReaderCamera.getVideoInputDevices()
  //    .then((videoInputDevices) => {
  //      const sourceSelect = document.getElementById('sourceSelect')
  //      selectedDeviceId = videoInputDevices[0].deviceId
  //      this.decodeContinuously(codeReaderCamera, selectedDeviceId);
  //      //this.decodeOnce(codeReaderCamera, selectedDeviceId);
  //      console.log(`Started decode from camera with id ${selectedDeviceId}`)
  //    })
  //    .catch((err) => {
  //      console.error(err)
  //    })
  //},
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
    },
    decodeOnce(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log(result)
        this.result = result.text;
      }).catch((err) => {
        console.error(err)
        this.result = err;
      })
    },
    decodeContinuously(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
        console.log(result);
        if (result) {
          console.log('Found QR code!', result)
          this.result = result.text;
        }
        if (err) {
          if (err instanceof NotFoundException) {
            console.log('No QR code found.')
          }
          if (err instanceof ChecksumException) {
            console.log('A code was found, but it\'s read value was not valid.')
          }
          if (err instanceof FormatException) {
            console.log('A code was found, but it was in a invalid format.')
          }
        }
      })
    }
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
#file .image img:first-child {
  max-height: 500px;
  max-width: 100%;
}
#result {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
