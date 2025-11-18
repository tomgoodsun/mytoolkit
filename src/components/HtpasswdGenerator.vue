<template>
  <TwoColumnEditor
    v-model:input-value="source"
    :output-value="result"
    left-id="htpasswd-source"
    right-id="htpasswd-result"
    left-placeholder="user:password"
    right-placeholder="Htpasswd result is the below."
    :left-message="errorMessage === '' ? 'Input user:password lines. Automatically generates if no password.' : errorMessage"
    right-message="Result"
    :left-status="errorMessage === '' ? 'success' : 'error'"
  >
    <template #left-buttons>
      <div class="op-btn">
        <BButton
          variant="light"
          size="sm"
          class="generate"
          title="Generate"
          @click="generate()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
            <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
          </svg> Generate
        </BButton>
      </div>
    </template>
  </TwoColumnEditor>
</template>

<script>
import { ref, onMounted } from 'vue'
import { BButton } from 'bootstrap-vue-next'
import TwoColumnEditor from './TwoColumnEditor.vue'
import Clipboard from 'clipboard'
import { randomPassword } from 'secure-random-password'

export default {
  components: {
    TwoColumnEditor,
    BButton
  },
  setup() {
    const source = ref('')
    const result = ref('')
    const errorMessage = ref('')

    const generate = () => {
      const sourceValue = source.value
      const newSource = []
      const data = new URLSearchParams()

      if (sourceValue.length === 0) {
        return false
      }

      sourceValue.split('\n').forEach((line, index) => {
        const parts = line.split(':')
        if (parts.length === 0 || parts[0].length === 0) {
          return false
        }
        if (parts.length <= 1 || parts[1].length === 0) {
          parts[1] = randomPassword({ length: 12 })
        }
        data.append(`data[${index}][user]`, parts[0])
        data.append(`data[${index}][password]`, parts[1])
        newSource.push(`${parts[0]}:${parts[1]}`)
      })

      const request = new Request(import.meta.env.VITE_APP_HTPASSWD_API || 'https://your-api-endpoint.com/htpasswd', {
        method: 'post',
        body: data
      })

      fetch(request)
        .then((response) => {
          if (response.ok) {
            response.json().then(json => {
              source.value = newSource.join('\n')
              result.value = json.join('\n')
            })
          }
        })
    }

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    return {
      source,
      result,
      errorMessage,
      generate
    }
  }
}
</script>
