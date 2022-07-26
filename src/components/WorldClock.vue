<template>
  <b-row>
    <b-col col lg="12" md="12" sm="12">
      <b-alert variant="info" show>
        Selected time zones are save in Cookie of your browser.
      </b-alert>

      <div v-for="timezone in timezones" :key="timezone.utc" :id=timezone.utc class="timezone">
        <div class="utc">
          UTC {{timezone.utc}}
        </div>
        <div class="clock">
          2022-01-01 00:00:00.123
        </div>
        <div class="regions">
          <span class="region-list">
            <span v-for="(region, index) in timezone.regions" :key="index" class="region">
              {{region}}
            </span>
          </span>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { BootstrapVue, AlertPlugin, LayoutPlugin } from 'bootstrap-vue';
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
        let date = DateTime
          .local()
          .toUTC(WorldClockTimeZones.LIST[i].offsetMin);

        let targetTime = date.toFormat('HHmm');
        let dateStr = date.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS');

        let element = document.getElementById(utc);
        element.style.backgroundColor = WorldClockTimeZones.findColor(targetTime);
        element
          .querySelectorAll('.clock')
          .forEach((element) => {
            element.innerHTML = dateStr;
          });
      }
      setTimeout(counter, 1);
    };
    counter();

    let testCounter = () => {
      let addMin = 0;
      let date = DateTime.local(2022, 1, 1, 0, 0, 0, 0);
      let counter = () => {
        for (let i in WorldClockTimeZones.LIST) {
          let utc = WorldClockTimeZones.LIST[i].utc;
          let tmpDate = date.plus({minutes: addMin}).toUTC(WorldClockTimeZones.LIST[i].offsetMin);

          let targetTime = tmpDate.toFormat('HHmm');

          let dateStr = tmpDate.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS');

          let element = document.getElementById(utc);
          element.style.backgroundColor = WorldClockTimeZones.findColor(targetTime);
          element
            .querySelectorAll('.clock')
            .forEach((element) => {
              element.innerHTML = dateStr;
            });
        }
        addMin += 4;
        setTimeout(counter, 1);
      };
      counter();
    };
    //testCounter();

  },
  methods: {
  },
  components: {
    AlertPlugin
  }
}
</script>

<style>
  .timezone {
    border: 3px solid #fff;
    color: #fff;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem 1rem;
    /*
    text-stroke: 0.5px #FFF;
    -webkit-text-stroke: 0.5px #FFF;
    */
  }
  .timezone .utc {
    float: left;
    /*font: 12px Monaco, Consolas, monospace;*/
    font-weight: bold;
    width: 80px;
  }
  .timezone .clock {
    float: left;
    font: 12px Monaco, Consolas, monospace;
    width: 200px;
  }
  .timezone .regions {
    display: inline-block;
    height: 1.2em;
    overflow: hidden;
    width: calc(100% - 200px - 80px);
  }

  @media screen and (max-width: 480px) {
    .timezone {
      margin: 0 0 1em 0;
    }
    .timezone .utc {
      float: none;
      font-size: 150%;
      width: 100%;
    }
    .timezone .clock {
      float: none;
      font-size: 120%;
      width: 100%;
    }
    .timezone .regions {
      display: inline-block;
      height: 1.2em;
      overflow: hidden;
      width: 100%;
    }

  }
</style>
