<template>
  <BRow>
    <!-- 左カラム：入力エリア -->
    <BCol cols="12" md="6">
      <BAlert v-if="leftStatus === 'error'" variant="danger" :model-value="true">
        {{ leftMessage }}
      </BAlert>
      <BAlert v-else :variant="leftStatus" :model-value="true">
        {{ leftMessage }}
      </BAlert>

      <BFormTextarea
        :id="leftId"
        class="code-textarea"
        :model-value="inputValue"
        :placeholder="leftPlaceholder"
        @update:model-value="handleInput"
      ></BFormTextarea>

      <!-- 左側の追加ボタンエリア（オプション） -->
      <slot name="left-buttons"></slot>
    </BCol>

    <!-- 右カラム：結果エリア -->
    <BCol cols="12" md="6" class="mt-3 mt-md-0">
      <BAlert v-if="rightStatus === 'error'" variant="danger" :model-value="true">
        {{ rightMessage }}
      </BAlert>
      <BAlert v-else-if="outputValue.length > 0" variant="info" :model-value="true">
        {{ rightMessage }}
      </BAlert>
      <BAlert v-else variant="dark" :model-value="true">
        {{ rightPlaceholder }}
      </BAlert>

      <BFormTextarea
        :id="rightId"
        class="code-textarea"
        :model-value="outputValue"
        readonly
      ></BFormTextarea>

      <div class="op-btn">
        <BButton
          variant="light"
          size="sm"
          class="clipboard"
          :data-clipboard-target="'#' + rightId"
          title="Copy to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
          </svg> Copy
        </BButton>

        <!-- 右側の追加ボタンエリア（オプション） -->
        <slot name="right-buttons"></slot>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { BRow, BCol, BAlert, BFormTextarea, BButton } from 'bootstrap-vue-next'

export default {
  name: 'TwoColumnEditor',
  components: {
    BRow,
    BCol,
    BAlert,
    BFormTextarea,
    BButton
  },
  props: {
    // 入力値
    inputValue: {
      type: String,
      default: ''
    },
    // 出力値
    outputValue: {
      type: String,
      default: ''
    },
    // 左カラムのID
    leftId: {
      type: String,
      default: 'input-area'
    },
    // 右カラムのID
    rightId: {
      type: String,
      default: 'output-area'
    },
    // 左カラムのプレースホルダー
    leftPlaceholder: {
      type: String,
      default: 'Enter text...'
    },
    // 右カラムのプレースホルダー（結果待ち時のメッセージ）
    rightPlaceholder: {
      type: String,
      default: 'Waiting for input...'
    },
    // 左カラムのAlertメッセージ
    leftMessage: {
      type: String,
      default: 'Input'
    },
    // 右カラムのAlertメッセージ
    rightMessage: {
      type: String,
      default: 'Result'
    },
    // 左カラムのステータス（success, error, warning, info, dark）
    leftStatus: {
      type: String,
      default: 'success'
    },
    // 右カラムのステータス（success, error, warning, info, dark）
    rightStatus: {
      type: String,
      default: 'info'
    }
  },
  emits: ['update:inputValue'],
  methods: {
    handleInput(value) {
      this.$emit('update:inputValue', value)
    }
  }
}
</script>
