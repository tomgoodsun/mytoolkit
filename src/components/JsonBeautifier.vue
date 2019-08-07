<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6">
        <b-form-textarea
          id="json-from"
          v-model="jsonFrom"
          placeholder="Enter JSON string..."
        ></b-form-textarea>
      </b-col>
      <b-col cols="6">
        <b-form-textarea
          id="json-to"
          v-model="jsonTo"
        ></b-form-textarea>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable */
import { BootstrapVue, BFormTextarea, LayoutPlugin } from 'bootstrap-vue'

export default {
  data() {
    console.log(this);
    return {
      'jsonTo': 'aaaaaaaaaaaaaa'
    };
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
</style>
