<template>
  <TwoColumnEditor
    v-model:input-value="mlFrom"
    :output-value="mlTo"
    left-id="ml-from"
    right-id="ml-to"
    left-placeholder="Enter Markup Language string..."
    right-placeholder="Waiting for Markup Language input..."
    :left-message="errorMessage === '' ? 'Input Markup Language string' : errorMessage"
    right-message="Markup Language parsed"
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
    const mlFrom = ref('')
    const mlTo = ref('')
    const errorMessage = ref('')

    watch(mlFrom, (newValue) => {
      setTimeout(() => {
        let parsedMl = ''
        let error = ''
        try {
          if (newValue.length > 0) {
            parsedMl = beautify.html(newValue, { indent_size: 2, space_in_empty_paren: true })
          }
        } catch (e) {
          error = 'Markup Language Parse Error.'
        }
        mlTo.value = parsedMl
        errorMessage.value = error
      }, 500)

      mlTo.value = ''
    })

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      mlFrom,
      mlTo,
      errorMessage
    }
  }
}
</script>
