<template>
  <b-row>
    <b-col col lg="12" md="12" sm="12">
      <div id="timezone-filter">
        <b-button
          variant="light"
          size="md"
          class="filter"
          alt="Show selected"
          @click="toggleFilter($event)"
        >
          <b-icon icon="filter-circle" aria-hidden="true" class="off"></b-icon>
          <b-icon icon="filter-circle-fill" aria-hidden="true" class="on"></b-icon>
        </b-button>
      </div>

      <b-alert variant="info" show>
        Selected time zones are save in Cookie of your browser.
      </b-alert>

      <div id="timezone-list">
        <div
          v-for="timezone in timezones"
          :key="timezone.utc"
          :id=timezone.utc
          class="timezone"
          @click="toggleTimeZone($event)"
        >
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
      </div>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { BootstrapVue, AlertPlugin, LayoutPlugin } from 'bootstrap-vue';
const { DateTime } = require("luxon");
import Cookies from 'js-cookie';
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js';

export default {
  data() {
    return {
      timezones: WorldClockTimeZones.LIST,
      settings: {
        showingAll: true,
        selectedTimeZoneIds: []
      }
    };
  },
  mounted() {
    this.restoreSettings();
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

    this.restoreSettings();
    this.initTimeZoneSelections();
    setInterval(this.saveSettings(), 60000);
  },
  methods: {
    /**
     * Toggle filter button and display
     */
    toggleFilter() {
      let element = document.getElementById('timezone-filter');
      let onElement = element.querySelectorAll('.on')[0];
      let offElement = element.querySelectorAll('.off')[0];
      if (this.settings.showingAll) {
        this.settings.showingAll = false;
        onElement.style.display = '';
        offElement.style.display = 'none';
      } else {
        this.settings.showingAll = true;
        onElement.style.display = 'none';
        offElement.style.display = '';
      }
      this.toggleDisplayOfTimeZones();
      this.saveSettings();
    },

    /**
     * Toggle timezone selection
     *
     * @param {Event} evt
     */
    toggleTimeZone(evt) {
      let element = evt.target;
      console.log(element.classList);
      while (!element.classList.contains('timezone')) {
        if ('body' === element.tagName) {
          break;
        }
        element = element.parentNode;
      }
      element.classList.toggle('selected');
      this.saveSettings();
    },

    /**
     * Initialize display settings
     */
    initTimeZoneSelections() {
      let element = document.getElementById('timezone-filter');
      let onElement = element.querySelectorAll('.on')[0];
      let offElement = element.querySelectorAll('.off')[0];
      if (this.settings.showingAll) {
        onElement.style.display = 'none';
        offElement.style.display = '';
      } else {
        onElement.style.display = '';
        offElement.style.display = 'none';
      }

      this.settings.selectedTimeZoneIds.forEach((id) => {
        let element = document.getElementById(id);
        if (!element.classList.contains('selected')) {
          element.classList.add('selected');
        }
      });
      this.toggleDisplayOfTimeZones();
    },

    /**
     * Toggle display of timezones
     */
    toggleDisplayOfTimeZones() {
      document
        .querySelectorAll('#timezone-list .timezone')
        .forEach((element) => {
          if (this.settings.showingAll) {
            element.style.display = 'block';
          } else {
            if (element.classList.contains('selected')) {
              element.style.display = 'block';
            } else {
              element.style.display = 'none';
            }
          }
        });
    },

    /**
     * Save settings to Cookie
     */
    saveSettings() {
      this.settings.selectedTimeZoneIds = [];
      document
        .querySelectorAll('#timezone-list .selected')
        .forEach((element) => {
          this.settings.selectedTimeZoneIds.push(element.id);
        });

        let jsonStr = JSON.stringify(this.settings);
        Cookies.set(
          'world-clock-settings',
          jsonStr,
          {
            expires: 7,
            path: location.pathname
          }
        );
        console.log(`Setting saved. ${jsonStr}`);
    },

    /**
     * Fetch settings from Cookie
     */
    restoreSettings() {
      let jsonStr = Cookies.get('world-clock-settings');
      let settings = {};
      if (undefined !== jsonStr) {
        settings = JSON.parse(jsonStr);
      }
      //this.settings = Object.assign(settings, this.settings);
      this.settings = settings;
      console.log(`Setting restored. ${jsonStr}`);
    }
  },
  components: {
    AlertPlugin
  }
}
</script>

<style>
  #timezone-filter {
    position: fixed;
    top: 0.5rem;
    right: 10px;
    z-index: 100;
  }
  #timezone-list .selected {
    border: 3px solid rgb(255, 153, 0);
  }
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
