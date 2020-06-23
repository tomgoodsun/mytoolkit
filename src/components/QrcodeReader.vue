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
          <div class="mt-3 qr-code-reader">
            <qrcode-stream class="qr-reader" @decode="onDecode" @init="onInit" />
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
  NotFoundException,
  ChecksumException,
  FormatException,
} from '@zxing/library';
import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(ButtonPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);
Vue.use(VueQrcodeReader);

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
    // @see https://gruhn.github.io/vue-qrcode-reader/demos/DecodeAll.html
    onDecode (result) {
      this.result = result
      imgElem.src = '';
      imgElem.alt = '';
    },
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    },

    readFromFile(evt) {
      let that = this;
      imgElem.src = '';
      imgElem.alt = '';

      let file = evt.target.files[0];
      let fr = new FileReader();
      fr.onload = function () {
        imgElem.src = fr.result;
        imgElem.alt = file.name;
        codeReader.decodeFromImage(imgElem).then((result) => {
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
#file .qr-code-reader {
  max-height: 100px;
  max-width: 100%;
}
#result {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
</style>
