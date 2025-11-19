<template>
  <TwoColumnEditor
    v-model:input-value="cssFrom"
    :output-value="cssTo"
    left-id="css-from"
    right-id="css-to"
    left-placeholder="Enter CSS string..."
    right-placeholder="Waiting for CSS input..."
    :left-message="errorMessage === '' ? 'Input CSS string' : errorMessage"
    right-message="CSS parsed"
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
    const cssFrom = ref('')
    const cssTo = ref('')
    const errorMessage = ref('')

    watch(cssFrom, (newValue) => {
      setTimeout(() => {
        let parsedCss = ''
        let error = ''
        try {
          if (newValue.length > 0) {
            parsedCss = beautify.css(newValue, { indent_size: 2, space_in_empty_paren: true })
          }
        } catch (e) {
          error = 'CSS Parse Error.'
        }
        cssTo.value = parsedCss
        errorMessage.value = error
      }, 500)

      cssTo.value = ''
    })

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      cssFrom,
      cssTo,
      errorMessage
    }
  }
}
</script>
