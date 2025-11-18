<template>
  <TwoColumnEditor
    v-model:input-value="sqlFrom"
    :output-value="sqlTo"
    left-id="sql-from"
    right-id="sql-to"
    left-placeholder="Enter SQL string..."
    right-placeholder="Waiting for SQL input..."
    :left-message="errorMessage === '' ? 'Input SQL string' : errorMessage"
    right-message="SQL parsed"
    :left-status="errorMessage === '' ? 'success' : 'error'"
  />
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import TwoColumnEditor from './TwoColumnEditor.vue'
import { format } from 'sql-formatter'
import Clipboard from 'clipboard'

export default {
  components: {
    TwoColumnEditor
  },
  setup() {
    const sqlFrom = ref('')
    const sqlTo = ref('')
    const errorMessage = ref('')

    watch(sqlFrom, (newValue) => {
      setTimeout(() => {
        let parsedSql = ''
        let error = ''
        try {
          if (newValue.length > 0) {
            parsedSql = format(newValue)
          }
        } catch (e) {
          error = 'SQL Parse Error.'
        }
        sqlTo.value = parsedSql
        errorMessage.value = error
      }, 500)

      sqlTo.value = ''
    })

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      sqlFrom,
      sqlTo,
      errorMessage
    }
  }
}
</script>
