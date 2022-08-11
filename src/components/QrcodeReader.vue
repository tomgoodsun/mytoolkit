<template>
  <b-form>
    <b-row>
      <b-col col lg="6" md="12" sm="12" id="file">
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

      <b-col col lg="6" md="12" sm="12">
        <b-alert v-if="$data.status=='error'" variant="danger" show>{{ errorMessage }}</b-alert>
        <b-alert v-else-if="$data.status== 'success'" variant="info" show>QR code has been read.</b-alert>
        <b-alert v-else variant="dark" show>Waiting for QR code...</b-alert>

        <b-form-textarea
          id="result"
          v-model="$data.result"
          readonly
        ></b-form-textarea>
        <div class="op-btn">
          <b-button
            variant="light"
            size="sm"
            class="clipboard"
            data-clipboard-target="#result"
            title="Copy to clipboard"
          >
            <b-icon icon="clipboard" aria-hidden="true"></b-icon> Copy
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import {
  AlertPlugin,
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
import Clipboard from 'clipboard';

Vue.use(ButtonPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);
Vue.use(AlertPlugin);
Vue.use(VueQrcodeReader);

const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
let imgElem;

export default {
  data() {
    return {
      alertMsg: '',
      file: null,
      result: '',
      status: 'info',
      errorMessage: ''
    }
  },
  mounted() {
    imgElem = document.querySelector('#file .image img:first-child');
    new Clipboard('.clipboard');
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
        this.status = 'info';
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.status = 'info';
          this.errorMessage = "INFO: you need to grant camera access permisson";
        } else if (error.name === 'NotFoundError') {
          this.status = 'info';
          this.errorMessage = "INFO: no camera on this device";
        } else if (error.name === 'NotSupportedError') {
          this.status = 'error';
          this.errorMessage = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === 'NotReadableError') {
          this.status = 'error';
          this.errorMessage = "ERROR: is the camera already in use?";
        } else if (error.name === 'OverconstrainedError') {
          this.status = 'error';
          this.errorMessage = "ERROR: installed cameras are not suitable";
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.status = 'error';
          this.errorMessage = "ERROR: Stream API is not supported in this browser";
        }
        console.error(this.errorMessage);
      }
    },

    readFromFile(evt) {
      this.status = 'info';
      let that = this;
      imgElem.src = '';
      imgElem.alt = '';

      let file = evt.target.files[0];
      let fr = new FileReader();
      fr.onload = function () {
        imgElem.src = fr.result;
        imgElem.alt = file.name;
        codeReader.decodeFromImage(imgElem).then((result) => {
          that.status = 'success';
          that.result = result.text;
          //resultForm.select();
          //console.log(resultForm);
        }).catch((err) => {
          that.status = 'error';
          that.errorMessage = err;
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
        this.status = 'error';
        this.errorMessage = err;
      })
    },
    decodeContinuously(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
        console.log(result);
        if (result) {
          this.status = 'success';
          this.errorMessage = 'Found QR code!';
          console.log('Found QR code!', result)
          this.result = result.text;
        }
        if (err) {
          if (err instanceof NotFoundException) {
            this.status = 'error';
            this.errorMessage = 'No QR code found.';
          }
          if (err instanceof ChecksumException) {
            this.status = 'error';
            this.errorMessage = 'A code was found, but it\'s read value was not valid.';
          }
          if (err instanceof FormatException) {
            this.status = 'error';
            this.errorMessage = 'A code was found, but it was in a invalid format.';
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
#file .qr-code-reader * {
  max-height: 300px;
  max-width: 300%;
}
#result {
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
