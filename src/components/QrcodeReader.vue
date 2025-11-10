<template>
  <BForm>
    <BRow>
      <BCol col lg="6" md="12" sm="12" id="file">
        <BFormFile
          v-model="file"
          accept="image/*"
          plain
          capture
          @change="readFromFile"
        ></BFormFile>
        <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
        <div class="mt-3 image">
          <img src="">
        </div>
        <div class="mt-3 qr-code-reader" :class="{'camera-available': cameraAvailable}">
          <qrcode-stream class="qr-reader" @decode="onDecode" @init="onInit" />
        </div>
      </BCol>

      <BCol col lg="6" md="12" sm="12">
        <BAlert v-if="status=='error'" variant="danger" :model-value="true">{{ errorMessage }}</BAlert>
        <BAlert v-else-if="status=='success'" variant="info" :model-value="true">QR code has been read.</BAlert>
        <BAlert v-else variant="dark" :model-value="true">Waiting for QR code...</BAlert>

        <BFormTextarea
          id="result"
          v-model="result"
          readonly
        ></BFormTextarea>
        <div class="op-btn">
          <BButton
            variant="light"
            size="sm"
            class="clipboard"
            data-clipboard-target="#result"
            title="Copy to clipboard"
          >
            📋 Copy
          </BButton>
        </div>
      </BCol>
    </BRow>
  </BForm>
</template>

<script>
/* eslint-disable */
import {
  BAlert,
  BForm,
  BFormTextarea,
  BFormFile,
  BFormGroup,
  BFormInput,
  BButton,
  BRow,
  BCol
} from 'bootstrap-vue-next'
import { ref, onMounted } from 'vue'
import {
  BrowserQRCodeReader,
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from '@zxing/library'
import { QrcodeStream } from 'vue-qrcode-reader'
import Clipboard from 'clipboard'

const codeReader = new BrowserMultiFormatReader()
let selectedDeviceId
let imgElem

export default {
  components: {
    BAlert,
    BForm,
    BFormTextarea,
    BFormFile,
    BFormGroup,
    BFormInput,
    BButton,
    BRow,
    BCol,
    QrcodeStream
  },
  setup() {
    const file = ref(null)
    const alertMsg = ref('')
    const cameraAvailable = ref(false)
    const result = ref('')
    const status = ref('info')
    const errorMessage = ref('')

    onMounted(() => {
      imgElem = document.querySelector('#file .image img:first-child')
      new Clipboard('.clipboard')
    })

    const onDecode = (decodedResult) => {
      status.value = 'success'
      result.value = decodedResult
      imgElem.src = ''
      imgElem.alt = ''
    }

    const onInit = async (promise) => {
      try {
        status.value = 'info'
        await promise
        cameraAvailable.value = true
      } catch (error) {
        cameraAvailable.value = false
        if (error.name === 'NotAllowedError') {
          status.value = 'info'
          errorMessage.value = "INFO: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          status.value = 'info'
          errorMessage.value = "INFO: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          status.value = 'error'
          errorMessage.value = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          status.value = 'error'
          errorMessage.value = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          status.value = 'error'
          errorMessage.value = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          status.value = 'error'
          errorMessage.value = "ERROR: Stream API is not supported in this browser"
        }
        console.error(errorMessage.value)
      }
    }

    const readFromFile = (evt) => {
      status.value = 'info'
      imgElem.src = ''
      imgElem.alt = ''

      let fileObj = evt.target.files[0]
      let fr = new FileReader()
      fr.onload = function () {
        imgElem.src = fr.result
        imgElem.alt = fileObj.name
        codeReader.decodeFromImage(imgElem).then((resultObj) => {
          status.value = 'success'
          result.value = resultObj.text
        }).catch((err) => {
          status.value = 'error'
          errorMessage.value = err
          console.error(err)
        })
      }
      fr.readAsDataURL(fileObj)
    }

    const decodeOnce = (codeReader, selectedDeviceId) => {
      codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((resultObj) => {
        console.log(resultObj)
        result.value = resultObj.text
      }).catch((err) => {
        console.error(err)
        result.value = err
        status.value = 'error'
        errorMessage.value = err
      })
    }

    const decodeContinuously = (codeReader, selectedDeviceId) => {
      codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (resultObj, err) => {
        console.log(resultObj)
        if (resultObj) {
          status.value = 'success'
          errorMessage.value = 'Found QR code!'
          console.log('Found QR code!', resultObj)
          result.value = resultObj.text
        }
        if (err) {
          if (err instanceof NotFoundException) {
            status.value = 'error'
            errorMessage.value = 'No QR code found.'
          }
          if (err instanceof ChecksumException) {
            status.value = 'error'
            errorMessage.value = 'A code was found, but it\'s read value was not valid.'
          }
          if (err instanceof FormatException) {
            status.value = 'error'
            errorMessage.value = 'A code was found, but it was in a invalid format.'
          }
        }
      })
    }

    return {
      file,
      alertMsg,
      cameraAvailable,
      result,
      status,
      errorMessage,
      onDecode,
      onInit,
      readFromFile,
      decodeOnce,
      decodeContinuously
    }
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
#file .qr-code-reader.camera-available {
  margin-bottom: 20px;
  max-height: 300px;
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
