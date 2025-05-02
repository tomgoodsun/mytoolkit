<template>
  <div
    :id=this.timezone.utc
    class="timezone"
    :style="{background: color}"
  >
    <div class="utc">UTC {{timezone.utc}}</div>
    <div class="clock">{{datetime}}</div>
    <div class="regions">
      <span class="region-list">
        <span v-for="(region, index) in timezone.regions" :key="index" class="region">
          {{region}}
        </span>
      </span>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
const { DateTime } = require("luxon");
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js';

export default {
  props: {
    timezone: Object
  },
  data() {
    return {
      datetime: '2022-01-01 00:00:00.123',
      color: 'white'
    };
  },
  mounted() {
      /**
     * Endless update datetime view
     */
     let counter = () => {
      //let utc = this.timezone.utc;
      let date = DateTime
        .local()
        .toUTC(this.timezone.offsetMin);

      let targetTime = date.toFormat('HHmm');
      let dateStr = date.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS');

      this.datetime = dateStr;
      this.color = WorldClockTimeZones.findColor(targetTime);

      setTimeout(counter, 1);
    };
    counter();

  }
}
</script>
<style scoped>

</style>
