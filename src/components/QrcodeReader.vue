<template>
  <BForm>
    <BRow>
      <BCol cols="12" md="6" id="file">
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
        
        <!-- デバッグ情報 -->
        <div v-if="debugInfo" class="mt-2 debug-info">
          <small>{{ debugInfo }}</small>
        </div>
        
        <div class="mt-3 qr-code-reader" :class="{'camera-available': cameraAvailable}">
          <qrcode-stream 
            class="qr-reader" 
            :constraints="constraints"
            :track="paintBoundingBox"
            @detect="onDetect"
            @decode="onDecode" 
            @init="onInit"
            @error="onError"
          >
            <div v-if="loading" class="loading-indicator">
              Loading camera...
            </div>
          </qrcode-stream>
        </div>
      </BCol>

      <BCol cols="12" md="6">
        <BAlert v-if="status=='error'" variant="danger" :model-value="true">{{ errorMessage }}</BAlert>
        <BAlert v-else-if="status=='success'" variant="info" :model-value="true">QR code has been read.</BAlert>
        <BAlert v-else-if="status=='detecting'" variant="warning" :model-value="true">QR code detected, decoding...</BAlert>
        <BAlert v-else variant="dark" :model-value="true">Waiting for QR code...</BAlert>

        <BFormTextarea
          id="result"
          class="code-textarea"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg> Copy
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
    const loading = ref(false)
    const debugInfo = ref('')

    // カメラの制約条件（解像度とフォーカスモード）
    const constraints = ref({
      facingMode: 'environment', // バックカメラを優先
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'environment'
      }
    })

    onMounted(() => {
      imgElem = document.querySelector('#file .image img:first-child')
      new Clipboard('.clipboard')
    })

    // QRコードの境界線を描画する関数
    const paintBoundingBox = (detectedCodes, ctx) => {
      for (const detectedCode of detectedCodes) {
        const {
          boundingBox: { x, y, width, height }
        } = detectedCode

        ctx.lineWidth = 3
        ctx.strokeStyle = '#00ff00'
        ctx.strokeRect(x, y, width, height)
        
        // 中央に十字線を描画
        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 2
        const centerX = x + width / 2
        const centerY = y + height / 2
        const crossSize = 20
        
        ctx.beginPath()
        ctx.moveTo(centerX - crossSize, centerY)
        ctx.lineTo(centerX + crossSize, centerY)
        ctx.moveTo(centerX, centerY - crossSize)
        ctx.lineTo(centerX, centerY + crossSize)
        ctx.stroke()
      }
    }

    // QRコード検出時（デコード前）
    const onDetect = (detectedCodes) => {
      if (detectedCodes.length > 0) {
        debugInfo.value = `Detected ${detectedCodes.length} code(s). Trying to decode...`
        console.log('Detected codes:', detectedCodes)
        
        // 検出されたコードから値を抽出
        detectedCodes.forEach((code, index) => {
          console.log(`Code ${index}:`, code)
          
          // rawValue, format, contentなど、様々なプロパティを確認
          const qrValue = code.rawValue || code.format || code.content || code.data
          
          if (qrValue && qrValue !== result.value) {
            status.value = 'success'
            result.value = qrValue
            debugInfo.value = `Successfully decoded: ${qrValue.substring(0, 50)}${qrValue.length > 50 ? '...' : ''}`
            console.log('QR Code value:', qrValue)
            
            // 読み取り成功時に音を鳴らす
            playBeep()
            
            // 画像をクリア
            imgElem.src = ''
            imgElem.alt = ''
          }
        })
      } else {
        if (status.value !== 'success') {
          debugInfo.value = 'Scanning...'
        }
      }
    }

    // QRコードデコード成功時（バックアップ）
    const onDecode = (decodedResult) => {
      console.log('Decode success:', decodedResult)
      if (decodedResult && decodedResult !== result.value) {
        status.value = 'success'
        result.value = decodedResult
        debugInfo.value = `Successfully decoded: ${decodedResult.substring(0, 50)}${decodedResult.length > 50 ? '...' : ''}`
        imgElem.src = ''
        imgElem.alt = ''
        
        // 読み取り成功時に音を鳴らす
        playBeep()
      }
    }

    // エラーハンドリング
    const onError = (error) => {
      console.error('QR Reader error:', error)
      errorMessage.value = `Error: ${error.message || error}`
      status.value = 'error'
    }

    const onInit = async (promise) => {
      loading.value = true
      debugInfo.value = 'Initializing camera...'
      try {
        status.value = 'info'
        const capabilities = await promise
        console.log('Camera capabilities:', capabilities)
        cameraAvailable.value = true
        loading.value = false
        debugInfo.value = 'Camera ready. Point at QR code.'
      } catch (error) {
        loading.value = false
        cameraAvailable.value = false
        debugInfo.value = ''
        if (error.name === 'NotAllowedError') {
          status.value = 'info'
          errorMessage.value = "INFO: you need to grant camera access permission"
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
        } else {
          status.value = 'error'
          errorMessage.value = `ERROR: ${error.message || error}`
        }
        console.error(errorMessage.value, error)
      }
    }

    const readFromFile = (evt) => {
      status.value = 'info'
      debugInfo.value = 'Reading from file...'
      imgElem.src = ''
      imgElem.alt = ''

      let fileObj = evt.target.files[0]
      if (!fileObj) {
        debugInfo.value = 'No file selected'
        return
      }

      let fr = new FileReader()
      fr.onload = function () {
        imgElem.src = fr.result
        imgElem.alt = fileObj.name
        debugInfo.value = 'Decoding image...'
        
        codeReader.decodeFromImage(imgElem).then((resultObj) => {
          status.value = 'success'
          result.value = resultObj.text
          debugInfo.value = 'Successfully decoded from image'
          console.log('File decode success:', resultObj.text)
          playBeep()
        }).catch((err) => {
          status.value = 'error'
          errorMessage.value = 'Could not decode QR code from image'
          debugInfo.value = `Error: ${err.message || err}`
          console.error('File decode error:', err)
        })
      }
      fr.readAsDataURL(fileObj)
    }

    // ビープ音を鳴らす（読み取り成功のフィードバック）
    const playBeep = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (e) {
        console.log('Audio feedback not available')
      }
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
      loading,
      debugInfo,
      constraints,
      paintBoundingBox,
      onDetect,
      onDecode,
      onError,
      onInit,
      readFromFile,
      decodeOnce,
      decodeContinuously
    }
  }
}
</script>

<style scoped>
#file .image img:first-child {
  max-height: 500px;
  max-width: 100%;
}
#file .qr-code-reader {
  max-height: 100px;
  max-width: 100%;
  position: relative;
}
#file .qr-code-reader.camera-available {
  margin-bottom: 20px;
  max-height: 480px;
  min-height: 300px;
}
#file .qr-code-reader * {
  max-width: 100%;
}

/* デバッグ情報 */
.debug-info {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  padding: 0.5rem;
  font-family: monospace;
}

/* ローディングインジケーター */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 1000;
}

/* QRコードリーダーのビデオ要素 */
.qr-reader {
  width: 100%;
  height: 100%;
}

/* カメラが利用可能な場合のスタイル */
.camera-available .qr-reader video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
