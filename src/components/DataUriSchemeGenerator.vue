<template>
  <BForm>
    <BRow>
      <BCol col lg="12" md="12" sm="12" id="file">
        <BFormFile
          accept="image/*"
          plain
          multiple
          @change="readFromFile"
        ></BFormFile>
        <div class="mt-3 images">
          <div class="result">

            <div v-for="(value) in result" :key="value.name" class="img-line">
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
                  :value="value.event.srcElement.result"
                >
                </textarea>
              </div>
              <div class="op-btn">
                <BButton
                  variant="light"
                  size="sm"
                  class="clipboard"
                  :data-clipboard-target="value.target"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </BButton>
              </div>
            </div>

          </div>
        </div>
      </BCol>
    </BRow>
  </BForm>
</template>

<script>
/* eslint-disable */
import {
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
  BrowserCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from '@zxing/library'
import Clipboard from 'clipboard'

let resultAreas = []
let fileCount = 0
let frResults = []
let frResultCount = 0

export default {
  components: {
    BForm,
    BFormTextarea,
    BFormFile,
    BFormGroup,
    BFormInput,
    BButton,
    BRow,
    BCol
  },
  setup() {
    const result = ref([])

    onMounted(() => {
      resultAreas = document.querySelectorAll('.result')
    })

    const loadImage = (index, file) => {
      let fr = new FileReader()
      fr.onload = function (evt) {
        frResults[index] = {
          index: index,
          id: 'data-uri-scheme-result-' + index,
          target: '#data-uri-scheme-result-' + index,
          file: file,
          event: evt
        }
        frResultCount++
      }
      fr.readAsDataURL(file)
    }

    const checkImageLoading = () => {
      console.log(frResults)
      if (fileCount == frResultCount) {
        result.value = frResults
        new Clipboard('.clipboard')
        return
      }
      setTimeout(checkImageLoading, 500)
    }

    const readFromFile = (evt) => {
      let files = evt.target.files

      fileCount = files.length
      frResults = []
      result.value = []
      frResultCount = 0

      for (let i = 0; i < fileCount; i++) {
        loadImage(i, files[i])
      }
      checkImageLoading()
    }

    return {
      result,
      readFromFile
    }
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
