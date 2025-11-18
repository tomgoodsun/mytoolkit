<template>
  <BRow>
    <BCol cols="12" md="6">
      <BAlert v-if="errorMessage === ''" variant="success" :model-value="true">
        Input JSON string
      </BAlert>
      <BAlert v-else variant="danger" :model-value="true">{{ errorMessage }}</BAlert>
      <BFormTextarea
        id="json-from"
        class="code-textarea"
        v-model="jsonFrom"
        placeholder="Enter JSON string..."
      ></BFormTextarea>
    </BCol>
    <BCol cols="12" md="6" class="mt-3 mt-md-0">
      <BAlert v-if="jsonTo.length > 0" variant="info" :model-value="true">JSON parsed</BAlert>
      <BAlert v-else variant="dark" :model-value="true">Waiting for JSON input...</BAlert>
      <BFormTextarea
        id="json-to"
        class="code-textarea"
        v-model="jsonTo"
        readonly
      ></BFormTextarea>
      <div class="op-btn">
        <BButton
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#json-to"
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
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { BRow, BCol, BAlert, BFormTextarea, BButton } from 'bootstrap-vue-next'
import Clipboard from 'clipboard'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BFormTextarea,
    BButton
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
