<template>
  <b-row>
    <b-col col lg="12" md="12" sm="12">
      <div v-for="timezone in timezones" :key="timezone.utc" :id=timezone.utc class="timezone">
        <div class="utc">UTC {{timezone.utc}}</div>
        <div class="clock">
          2022-01-01 00:00:00.123
        </div>
        <div class="regions">
            <span v-for="(region, index) in timezone.regions" :key="index" class="region">
              {{region}}
            </span>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { BootstrapVue, LayoutPlugin } from 'bootstrap-vue';
const { DateTime } = require("luxon");
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js';

export default {
  data() {
    return {
      'timezones': WorldClockTimeZones.LIST
    };
  },
  mounted() {
    let counter = () => {
      for (let i in WorldClockTimeZones.LIST) {
        let utc = WorldClockTimeZones.LIST[i].utc;
        let dateStr = DateTime
          .local()
          .toUTC(WorldClockTimeZones.LIST[i].utc_min)
          .toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS');
        document.getElementById(utc).querySelectorAll('.clock').forEach((element) => {
          element.innerHTML = dateStr;
        });
      }
      setTimeout(counter, 1);
    };
    counter();
  },
  methods: {
  },
  components: {
  }
}
</script>

<style>
  .timezone .utc {
    float: left;
    font: 12px Monaco, monospace;
    width: 70px;
  }
  .timezone .clock {
    float: left;
    font: 12px Monaco, monospace;
    width: 200px;
  }
  .timezone .regions {
    display: inline-block;
    height: 1.2em;
    overflow: hidden;
    width: calc(100% - 200px - 70px);
  }
  .timezone .regions .region {
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
