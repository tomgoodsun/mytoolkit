<template>
  <TwoColumnEditor
    v-model:input-value="jsonFrom"
    :output-value="jsonTo"
    left-id="json-from"
    right-id="json-to"
    left-placeholder="Enter JSON string..."
    right-placeholder="Waiting for JSON input..."
    :left-message="errorMessage === '' ? 'Input JSON string' : errorMessage"
    right-message="JSON parsed"
    :left-status="errorMessage === '' ? 'success' : 'error'"
  />
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import TwoColumnEditor from './TwoColumnEditor.vue'
import Clipboard from 'clipboard'

export default {
  components: {
    TwoColumnEditor
  },
  setup() {
    const jsonFrom = ref('')
    const jsonTo = ref('')
    const errorMessage = ref('')

    watch(jsonFrom, (newValue) => {
      setTimeout(() => {
        let parsedJson = ''
        let error = ''
        try {
          if (newValue.length > 0) {
            parsedJson = JSON.stringify(JSON.parse(newValue), null, 2)
          }
        } catch (e) {
          error = 'JSON Parse Error.'
        }
        jsonTo.value = parsedJson
        errorMessage.value = error
      }, 500)

      jsonTo.value = ''
    })

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      jsonFrom,
      jsonTo,
      errorMessage
    }
  }
}
</script>
