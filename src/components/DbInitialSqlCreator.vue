<template>
  <BForm @reset="onReset" v-if="show">
    <BRow>
      <BCol cols="12" md="6" class="input-area">
        <BFormGroup id="input-group-database" label="Database:" label-for="database">
          <BFormInput
            id="database"
            name="database"
            v-model="form.database"
            required
          ></BFormInput>
        </BFormGroup>

        <BFormGroup id="input-group-username" label="User name:" label-for="username">
          <BFormInput
            id="username"
            name="username"
            v-model="form.username"
            required
          ></BFormInput>
        </BFormGroup>

        <BFormGroup id="input-group-password" label="Password:" label-for="password">
          <BFormInput
            id="password"
            name="password"
            v-model="form.password"
            required
          ></BFormInput>
          <BFormCheckbox
            v-model="form.useNativePassword"
            name="useNativePassword"
            value="1"
            unchecked-value="0"
          >
            Use native password
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup label="Charset: ">
          <BFormSelect
            v-model="form.charsetsSelected"
            :options="form.charsets"
            true-value="yes"
            false-value="no"
            @change="updateCharsets($event)"
          ></BFormSelect>
        </BFormGroup>

        <BFormGroup label="Collation: ">
          <BFormSelect
            v-model="form.collationsSelected"
            :options="form.collations"
          ></BFormSelect>
        </BFormGroup>

        <BFormGroup label="Hosts: ">
          <BFormCheckbox
            v-for="defaultHost in form.hosts"
            v-model="form.hostsSelected"
            :key="defaultHost.value"
            :value="defaultHost.value"
            :disabled="defaultHost.disabled"
            :unchecked-value="defaultHost.uncheckedValue"
            name="hosts"
            @change="updateHostCheckbox($event)"
          >
            {{ defaultHost.text }}
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup id="input-group-custom-hosts" label="Custom hosts:" label-for="custom-hosts">
          <BFormTextarea
            id="custom-hosts"
            v-model="form.customHosts"
          ></BFormTextarea>
        </BFormGroup>

        <BButton variant="outline-primary" name="generate" @click="generate()">Generate</BButton>

        <BModal ref="resultSqlModal" id="result-sql-modal" size="lg" title="Generated Result" no-focus>
          <BFormTextarea readonly v-model="resultSql" id="result-sql" size="sm" rows="10"></BFormTextarea>
          <template #footer="{ hide }">
            <BButton variant="light" size="md" class="clipboard" data-clipboard-target="#result-sql" alt="Copy to clipboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
              </svg> Copy
            </BButton>
            <BButton size="md" variant="primary" @click="hide()">
              ✕ Close
            </BButton>
          </template>
        </BModal>

      </BCol>

      <BCol cols="12" md="6" class="result-area">

        <BFormGroup label="Privileges: " id="privileges">
          <div class="buttons">
            <BButton variant="outline-primary" name="resetPrivileges" @click="resetPrivileges()">Reset</BButton>
            <BButton variant="outline-primary" name="checkAllPrivileges" @click="checkAllPrivileges()">Check All</BButton>
            <BButton variant="outline-primary" name="uncheckAllPrivileges" @click="uncheckAllPrivileges()">Uncheck All</BButton>
          </div>
          <BFormCheckbox
            v-for="privilege in form.privileges"
            v-model="form.privilegesSelected"
            :key="privilege.value"
            :value="privilege.value"
            name="privileges"
          >
            {{ privilege.text }}
          </BFormCheckbox>
        </BFormGroup>

      </BCol>

    </BRow>
  </BForm>
</template>

<script>
/* eslint-disable */
import {
  BForm,
  BFormTextarea,
  BFormInput,
  BFormGroup,
  BFormCheckbox,
  BFormSelect,
  BButton,
  BModal,
  BRow,
  BCol
} from 'bootstrap-vue-next'
import { ref, onMounted } from 'vue'
import DbInitialSql from '../libraries/DbInitialSql.js'
import DbInitialSqlGenerator from '../libraries/DbInitialSqlGenerator.js'
import Clipboard from 'clipboard'

export default {
  components: {
    BForm,
    BFormTextarea,
    BFormInput,
    BFormGroup,
    BFormCheckbox,
    BFormSelect,
    BButton,
    BModal,
    BRow,
    BCol
  },
  setup() {
    const dis = new DbInitialSql()
    const form = ref(dis.getDefaultFormValues())
    const alertMsg = ref('')
    const resultSql = ref('')
    const show = ref(true)
    const resultSqlModal = ref(null)

    onMounted(() => {
      new Clipboard('.clipboard')
    })

    const onReset = (evt) => {
      const dis = new DbInitialSql()
      evt.preventDefault()
      form.value = dis.getDefaultFormValues()
      alertMsg.value = ''
      resultSql.value = ''
      show.value = false
      setTimeout(() => {
        show.value = true
      }, 0)
    }

    const updateHostCheckbox = (evt) => {
      const dis = new DbInitialSql()
      form.value.hosts = dis.getDefaultHosts(evt.includes('%'))
    }

    const updateCharsets = (evt) => {
      const dis = new DbInitialSql()
      form.value.collations = dis.getCollations(evt)
    }

    const resetPrivileges = () => {
      const dis = new DbInitialSql()
      form.value.privilegesSelected = dis.getPrivilegesSelected()
    }

    const checkAllPrivileges = () => {
      const dis = new DbInitialSql()
      form.value.privilegesSelected = dis.getPrivilegesSelectedAll()
    }

    const uncheckAllPrivileges = () => {
      form.value.privilegesSelected = []
    }

    const generate = () => {
      const generator = new DbInitialSqlGenerator(form.value)
      const sql = generator.generate()
      if (sql.length === 0) {
        const alertMessage = 'SQL could not be created due to lack of parameters.'
        alert(alertMessage)
        alertMsg.value = alertMessage
        return
      }
      resultSql.value = sql
      resultSqlModal.value.show()
    }

    return {
      form,
      alertMsg,
      resultSql,
      show,
      resultSqlModal,
      onReset,
      updateHostCheckbox,
      updateCharsets,
      resetPrivileges,
      checkAllPrivileges,
      uncheckAllPrivileges,
      generate
    }
  }
}
</script>

<style>
#result-sql {
  color: var(--normal-text-color) !important;
  font-family: Monaco, monospace;
}
#privileges .buttons button {
  margin-bottom: 5px;
}
.input-area button {
  margin-top: 1rem;
}
.result-area .buttons button {
  margin-right: 5px;
}
</style>
