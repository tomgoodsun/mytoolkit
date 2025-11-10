<template>
  <BRow>
    <BCol col lg="6" md="12" sm="12" class="input-area">
      <BFormGroup id="input-group-min" label="Min Length:" label-for="min-exclude">
        <BFormInput
          id="min-exclude"
          name="min-exclude"
          v-model="minLength"
        ></BFormInput>
      </BFormGroup>

      <BFormGroup id="input-group-max" label="Max Length:" label-for="max-exclude">
        <BFormInput
          id="max-exclude"
          name="max-exclude"
          v-model="maxLength"
        ></BFormInput>
      </BFormGroup>

      <BFormGroup id="input-group-settings" label="Setting:" label-for="settings">
        <BFormCheckbox
          v-for="form in forms"
          v-model="checked"
          :key="form.id"
          :value="form.id"
          name="settings"
        >
          {{ form.name }}
        </BFormCheckbox>
      </BFormGroup>

      <BFormGroup id="input-group-exclude" label="Exclude Chars:" label-for="exclude">
        <BFormInput
          id="exclude"
          name="exclude"
          v-model="excludeChars"
        ></BFormInput>
      </BFormGroup>

      <BFormGroup id="input-group-num" label="Sampling Num:" label-for="num">
        <BFormInput
          id="num"
          name="num"
          v-model="samplingNum"
        ></BFormInput>
      </BFormGroup>

      <BButton variant="outline-primary" name="generate" @click="generate()">Generate</BButton>

    </BCol>
    <BCol col lg="6" md="12" sm="12" class="result-area">
      <h3>Password Results</h3>
      <h4>
        Drawn
        <BButton
          variant="primary"
          size="sm"
          name="generate"
          @click="draw()"
        >
          Draw from results
        </BButton>
        <BButton
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#drawn-result"
          title="Copy to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
          </svg> Copy
        </BButton>
        <BButton variant="light" size="sm" class="stock" @click="stock()">Stock</BButton>
      </h4>
      <div id="drawn-result">
        {{ drawnPassword }}
      </div>
      <h4>Generated</h4>
      <div id="result-area">
        <ul id="result">
          <li
           v-for="password in passwords"
           :key="password.id"
           :class="{'is-selected': password.isSelected}"
           class="password"
          >
            {{ password.password }}
          </li>
        </ul>
      </div>

      <h4>
        Stock
        <BButton
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#password-stocker"
          title="Copy to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
          </svg> Copy
        </BButton>
        <BButton
          variant="light"
          size="sm"
          class="clear-stock"
          @click="clearStock()"
        >
          Clear
        </BButton>
      </h4>

      <BFormTextarea
        id="password-stocker"
        v-model="stockedPasswords"
        readonly
      ></BFormTextarea>
     </BCol>
  </BRow>
</template>

<script>
import { ref, onMounted, onUpdated } from 'vue'
import { BRow, BCol, BButton, BFormCheckbox, BFormGroup, BFormInput, BFormTextarea } from 'bootstrap-vue-next'
import Clipboard from 'clipboard'
import { randomPassword } from 'secure-random-password'

export default {
  components: {
    BRow, BCol, BButton, BFormCheckbox, BFormGroup, BFormInput, BFormTextarea
  },
  setup() {
    const forms = ref([
      { id: 'length', name: 'Length' },
      { id: 'numbers', name: 'Include Numbers' },
      { id: 'symbols', name: 'Include Symbols' },
      { id: 'noDuplicateCharacters', name: 'No Duplicate Characters' },
      { id: 'exclude', name: 'Exclude' },
      { id: 'strict', name: 'Strict' }
    ])

    const checked = ref(['length', 'numbers', 'symbols', 'noDuplicateCharacters', 'exclude', 'strict'])
    const minLength = ref(6)
    const maxLength = ref(10)
    const excludeChars = ref('')
    const samplingNum = ref(100)
    const passwords = ref([])
    const drawnPassword = ref('')
    const stockedPasswords = ref('')

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    const generate = () => {
      drawnPassword.value = ''
      const passwordList = []
      const options = {
        length: 10,
        characters: []
      }

      // Build character set based on checked options
      if (checked.value.includes('numbers')) {
        options.characters.push({ characters: '0123456789' })
      }
      if (checked.value.includes('symbols')) {
        options.characters.push({ characters: '!@#$%^&*()_+-=[]{}|;:,.<>?' })
      }

      // Always include letters unless explicitly excluded
      let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (checked.value.includes('exclude') && excludeChars.value) {
        const excludeList = excludeChars.value.split('')
        excludeList.forEach(char => {
          letters = letters.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
        })
      }
      options.characters.push({ characters: letters })

      const noDuplicates = checked.value.includes('noDuplicateCharacters')

      for (let i = 0; i < samplingNum.value; i++) {
        options.length = getRandomInt(minLength.value, maxLength.value)
        let password = ''
        try {
          if (noDuplicates) {
            // Generate password without duplicate characters
            const allChars = options.characters.map(c => c.characters).join('')
            const uniqueChars = [...new Set(allChars.split(''))]
            const maxPossibleLength = Math.min(options.length, uniqueChars.length)

            // Shuffle and pick characters
            const shuffled = uniqueChars.sort(() => 0.5 - Math.random())
            password = shuffled.slice(0, maxPossibleLength).join('')
          } else {
            password = randomPassword(options)
          }
        } catch (e) {
          // If character set is empty, use default
          password = randomPassword({ length: options.length })
        }
        passwordList.push({ id: i, password: password, isSelected: false })
      }
      passwords.value = passwordList
    }

    const draw = () => {
      if (passwords.value.length > 0) {
        passwords.value.forEach(p => { p.isSelected = false })
        const index = getRandomInt(0, passwords.value.length - 1)
        passwords.value[index].isSelected = true
        drawnPassword.value = passwords.value[index].password
      }
    }

    const stock = () => {
      if (drawnPassword.value.length > 0) {
        const arr = stockedPasswords.value.split('\n')
        if (arr.includes(drawnPassword.value)) {
          alert('This word is already stocked.')
          return
        }
        stockedPasswords.value += drawnPassword.value + '\n'
        const stocker = document.querySelector('#password-stocker')
        if (stocker) stocker.scrollTop = stocker.scrollHeight
      }
    }

    const clearStock = () => { stockedPasswords.value = '' }

    onMounted(() => { new Clipboard('.clipboard') })

    onUpdated(() => {
      const area = document.querySelector('#result-area')
      const result = document.querySelector('#result')
      const selected = document.querySelector('#result .is-selected')

      if (area) {
        area.scrollTop = 0
        if (selected && result) {
          const pPos = result.getBoundingClientRect()
          const cPos = selected.getBoundingClientRect()
          area.scrollTop = cPos.top - pPos.top
        }
      }
    })

    return { forms, checked, minLength, maxLength, excludeChars, samplingNum, passwords, drawnPassword, stockedPasswords, generate, draw, stock, clearStock }
  }
}
</script>

<style>
#result-area { border: 1px solid #eee; height: 200px; margin-bottom: 10px; min-height: 100px; overflow-y: scroll; }
#result { list-style: none; margin: 0; padding: 0; }
#drawn-result, #result .password { background: #eee; color: #666; display: inline-block; font: 12px Monaco, monospace; margin: 3px 2px; padding: 3px 5px; }
#result .is-selected { background: #666; color: #eee; }
#drawn-result { display: block; font-size: 30px; height: 1.5em; min-height: 1.5em; text-align: center; }
#password-stocker { font-family: Monaco, monospace; font-size: 100%; height: 100px; min-height: 100px; }
.input-area button[name="generate"] { margin-top: 1rem; }
.result-area button { margin-left: 5px !important; }
</style>
