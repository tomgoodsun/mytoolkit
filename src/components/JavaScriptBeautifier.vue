<template>
  <TwoColumnEditor
    v-model:input-value="jsFrom"
    :output-value="jsTo"
    left-id="js-from"
    right-id="js-to"
    left-placeholder="Enter JavaScript string..."
    right-placeholder="Waiting for JavaScript input..."
    :left-message="errorMessage === '' ? 'Input JavaScript string' : errorMessage"
    right-message="JavaScript parsed"
    :left-status="errorMessage === '' ? 'success' : 'error'"
  />
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import TwoColumnEditor from './TwoColumnEditor.vue'
import beautify from 'js-beautify'
import Clipboard from 'clipboard'

export default {
  components: {
    TwoColumnEditor
  },
  setup() {
    const jsFrom = ref('')
    const jsTo = ref('')
    const errorMessage = ref('')

    watch(jsFrom, (newValue) => {
      setTimeout(() => {
        let parsedJs = ''
        let error = ''
        try {
          if (newValue.length > 0) {
            parsedJs = beautify.js(newValue, { indent_size: 2, space_in_empty_paren: true })
          }
        } catch (e) {
          error = 'JavaScript Parse Error.'
        }
        jsTo.value = parsedJs
        errorMessage.value = error
      }, 500)

      jsTo.value = ''
    })

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      jsFrom,
      jsTo,
      errorMessage
    }
  }
}
</script>
