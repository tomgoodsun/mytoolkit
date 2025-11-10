<template>
  <BRow>
    <BCol col lg="6" md="12" sm="12">
      <BAlert v-if="errorMessage === ''" variant="success" :model-value="true">
        Input user:password lines. Automatically generates if no password.
      </BAlert>
      <BAlert v-else variant="danger" :model-value="true">{{ errorMessage }}</BAlert>
      <BFormTextarea
        id="htpasswd-source"
        v-model="source"
        placeholder="user:password"
      ></BFormTextarea>
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
    </BCol>
    <BCol col lg="6" md="12" sm="12">
      <BAlert v-if="result.length > 0" variant="info" :model-value="true">Result</BAlert>
      <BAlert v-else variant="dark" :model-value="true">Htpasswd result is the below.</BAlert>
      <BFormTextarea
        id="htpasswd-result"
        v-model="result"
        readonly
      ></BFormTextarea>
      <div class="op-btn">
        <BButton
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#htpasswd-result"
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
import { ref, onMounted } from 'vue'
import { BRow, BCol, BAlert, BFormTextarea, BButton } from 'bootstrap-vue-next'
import Clipboard from 'clipboard'
import { randomPassword } from 'secure-random-password'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BFormTextarea,
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

<style>
#htpasswd-result, #htpasswd-source {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 500px;
  min-height: 300px;
}
.op-btn {
  margin-top: 0.5rem;
  text-align: right;
}
</style>
