<template>
  <b-row>
    <b-col col lg="12" md="12" sm="12">
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
    let findColor = (targetTime) => {
      let time = null;
      let color = null;
      //console.log(WorldClockTimeZones.COLOR_DEFINITIONS);
      for (let i in WorldClockTimeZones.COLOR_DEFINITIONS) {
        time = WorldClockTimeZones.COLOR_DEFINITIONS[i][0];
        color = WorldClockTimeZones.COLOR_DEFINITIONS[i][1];
        //console.log(`${time} > ${targetTime}`);
        if (time >= targetTime) {
          break;
        }
      }
      //console.log(`${time} >= ${targetTime} | ${color}`);
      return color;
    };

    let counter = () => {
      for (let i in WorldClockTimeZones.LIST) {
        let utc = WorldClockTimeZones.LIST[i].utc;
        let date = DateTime
          .local()
          .toUTC(WorldClockTimeZones.LIST[i].offsetMin);

        let targetTime = date.toFormat('HHmm');
        let dateStr = date.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS');

        let element = document.getElementById(utc);
        element.style.backgroundColor = findColor(targetTime);
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
          element.style.backgroundColor = findColor(targetTime);
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
  }
}
</script>

<style>
  /**
   * noon    : #7ae0ff rgb(120, 220, 255) / decimal 8052991
   * midnight: #0a191e rgb( 10,  25,  30) / decimal 661790
   * diff    : 110, 195, 225 / deimal 7391201
   *
   * 86400sec. 1440min. 24hrs. / 43200sec. 720min. 12hrs.
   *
   * 7391201 / 43200 = 171.09261574
   * 7391201 / 720 = 10265.5569444...
   */
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
