<template>
  <BForm>
    <BRow>
      <BCol cols="12" md="6">
        <BFormFile
          v-model="file"
          accept="image/*"
          plain
          capture
          @change="readFromFile"
        ></BFormFile>
        <div class="mt-2">Selected file: {{ file ? file.name : '' }}</div>
        <BButton variant="outline-secondary" size="sm" class="mt-2" @click="readFromClipboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-image" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            <path d="M10.648 7.646a.5.5 0 0 1 .577-.093l1.775 1.018V14H3v-1.015l3.217-4.39a.5.5 0 0 1 .783-.035l2.01 2.51 1.925-3.425z"/>
            <path d="M6.25 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/>
          </svg>
          Paste from Clipboard <small class="text-muted">(Ctrl+V)</small>
        </BButton>

        <div class="mt-3 image">
          <img src="" alt="">
        </div>

        <!-- デバッグ情報 -->
        <div v-if="debugInfo" class="mt-3 debug-info">
          <small>{{ debugInfo }}</small>
        </div>

        <div class="mt-3 qr-code-reader" :class="{'camera-available': cameraAvailable}">
          <qrcode-stream
            class="qr-reader"
            :constraints="constraints"
            :track="paintBoundingBox"
            @detect="onDetect"
            @camera-on="onCameraOn"
            @camera-off="onCameraOff"
            @error="onError"
          >
            <div v-if="loading" class="loading-indicator">
              Loading camera...
            </div>
          </qrcode-stream>
        </div>
      </BCol>

      <BCol cols="12" md="6" class="mt-3 mt-md-0">
        <template v-if="status === 'error'">
          <BAlert variant="danger" :model-value="true">{{ errorMessage }}</BAlert>
        </template>
        <template v-else-if="status === 'success'">
          <Transition name="read-flash" appear>
            <BAlert :key="readCount" variant="info" :model-value="true">
              QR code has been read.
              <span v-if="readCount > 1" class="badge bg-primary ms-2">×{{ readCount }}</span>
            </BAlert>
          </Transition>
        </template>
        <template v-else-if="status === 'detecting'">
          <BAlert variant="warning" :model-value="true">QR code detected, decoding...</BAlert>
        </template>
        <template v-else>
          <BAlert variant="dark" :model-value="true">Waiting for QR code...</BAlert>
        </template>

        <BFormTextarea
          id="result"
          class="code-textarea"
          :class="{ 'flash-active': flashActive }"
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
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
    const readCount = ref(0)
    const flashActive = ref(false)
    let flashTimer = null

    // カメラの制約条件（getUserMedia の video オプションとして直接渡される）
    const constraints = ref({
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    })

    const setSuccess = (value, debugMsg) => {
      readCount.value++
      status.value = 'success'
      result.value = value
      debugInfo.value = debugMsg
      // Remove then re-add the flash class so the animation replays even on repeated reads
      flashActive.value = false
      nextTick(() => { flashActive.value = true })
      if (flashTimer) clearTimeout(flashTimer)
      flashTimer = setTimeout(() => { flashActive.value = false }, 700)
      playBeep()
    }

    const decodeFromImageData = async (dataUrl, sourceName) => {
      debugInfo.value = `Decoding image from ${sourceName}...`

      // Show preview
      if (imgElem) {
        imgElem.src = dataUrl
        imgElem.alt = sourceName
      }

      // Use a fresh Image element and wait for it to fully load before decoding
      const img = new Image()
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = dataUrl
        })

        const resultObj = await codeReader.decodeFromImage(img)
        setSuccess(resultObj.text, `Successfully decoded from ${sourceName}`)
      } catch (err) {
        status.value = 'error'
        errorMessage.value = `Could not decode QR code from ${sourceName}`
        debugInfo.value = `Error: ${err.message || err}`
        console.error(`Decode error (${sourceName}):`, err)
      }
    }

    const readFromClipboard = async () => {
      status.value = 'info'
      debugInfo.value = 'Reading from clipboard...'

      if (!navigator.clipboard?.read) {
        status.value = 'error'
        errorMessage.value = 'Clipboard API is not supported. Try Ctrl+V to paste.'
        debugInfo.value = 'Clipboard API not supported'
        return
      }

      try {
        const clipboardItems = await navigator.clipboard.read()
        let imageFound = false

        for (const clipboardItem of clipboardItems) {
          const imageType = clipboardItem.types.find(type => type.startsWith('image/'))
          if (imageType) {
            imageFound = true
            const blob = await clipboardItem.getType(imageType)
            const fr = new FileReader()
            fr.onload = () => decodeFromImageData(fr.result, 'clipboard')
            fr.readAsDataURL(blob)
            break
          }
        }

        if (!imageFound) {
          status.value = 'error'
          errorMessage.value = 'No image found in clipboard. Copy an image first.'
          debugInfo.value = 'No image in clipboard'
        }
      } catch (err) {
        status.value = 'error'
        errorMessage.value = err.name === 'NotAllowedError'
          ? 'Clipboard access denied. Please allow clipboard access.'
          : `Clipboard error: ${err.message || err}`
        debugInfo.value = `Clipboard error: ${err.message || err}`
        console.error('Clipboard error:', err)
      }
    }

    const handlePaste = (evt) => {
      const items = evt.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          evt.preventDefault()
          const blob = item.getAsFile()
          if (!blob) continue
          status.value = 'info'
          debugInfo.value = 'Reading from paste...'
          const fr = new FileReader()
          fr.onload = () => decodeFromImageData(fr.result, 'pasted image')
          fr.readAsDataURL(blob)
          break
        }
      }
    }

    onMounted(() => {
      imgElem = document.querySelector('.image img')
      new Clipboard('.clipboard')
      document.addEventListener('paste', handlePaste)
    })

    onUnmounted(() => {
      document.removeEventListener('paste', handlePaste)
      if (flashTimer) clearTimeout(flashTimer)
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
            setSuccess(qrValue, `Successfully decoded: ${qrValue.substring(0, 50)}${qrValue.length > 50 ? '...' : ''}`)
            console.log('QR Code value:', qrValue)
            if (imgElem) {
              imgElem.src = ''
              imgElem.alt = ''
            }
          }
        })
      } else {
        if (status.value !== 'success') {
          debugInfo.value = 'Scanning...'
        }
      }
    }

    // エラーハンドリング
    const onError = (error) => {
      console.error('QR Reader error:', error)
      errorMessage.value = `Error: ${error.message || error}`
      status.value = 'error'
    }

    // camera-on: カメラ起動成功時（v5.x API）
    const onCameraOn = (capabilities) => {
      console.log('Camera capabilities:', capabilities)
      cameraAvailable.value = true
      loading.value = false
      status.value = 'info'
      debugInfo.value = 'Camera ready. Point at QR code.'
    }

    // camera-off: カメラ停止時（v5.x API）
    const onCameraOff = () => {
      cameraAvailable.value = false
      loading.value = true
      debugInfo.value = 'Initializing camera...'
    }

    const readFromFile = (evt) => {
      status.value = 'info'

      const fileObj = evt.target.files[0]
      // Reset the input so the same file can trigger change again next time
      evt.target.value = ''

      if (!fileObj) {
        debugInfo.value = 'No file selected'
        return
      }

      const fr = new FileReader()
      fr.onload = () => decodeFromImageData(fr.result, fileObj.name)
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
      readCount,
      flashActive,
      constraints,
      paintBoundingBox,
      onDetect,
      onCameraOn,
      onCameraOff,
      onError,
      readFromFile,
      readFromClipboard,
      decodeOnce,
      decodeContinuously
    }
  }
}
</script>

<style scoped>
.image {
  max-width: 100%;
  overflow: hidden;
}

.image img {
  max-height: 400px;
  max-width: 100%;
  height: auto;
  display: block;
}

.qr-code-reader {
  max-width: 100%;
  position: relative;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code-reader.camera-available {
  min-height: 300px;
  max-height: 480px;
}

.qr-reader {
  width: 100%;
  height: 100%;
  min-height: inherit;
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
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 1000;
  font-weight: bold;
}

/* QRコードリーダーのビデオ要素 */
.qr-reader :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* カメラが利用可能な場合のcanvas */
.camera-available .qr-reader :deep(canvas) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 読み取り成功アラートのリプレイアニメーション */
.read-flash-enter-active {
  animation: alert-flash-in 0.45s ease-out;
}

@keyframes alert-flash-in {
  0%   { opacity: 0.2; transform: translateY(-5px) scale(0.98); }
  45%  { opacity: 1;   transform: translateY(1px)  scale(1.01); }
  100% { opacity: 1;   transform: translateY(0)    scale(1); }
}

/* テキストエリアの枠パルス */
.code-textarea.flash-active {
  animation: textarea-pulse 0.7s ease-out;
}

@keyframes textarea-pulse {
  0%   { box-shadow: 0 0 0 0   rgba(13, 110, 253, 0.8); }
  35%  { box-shadow: 0 0 0 6px rgba(13, 110, 253, 0.4); }
  100% { box-shadow: 0 0 0 0   rgba(13, 110, 253, 0); }
}
</style>
