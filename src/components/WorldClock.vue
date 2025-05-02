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
        <WorldClockTimeZone
          v-for="timezone in timezones"
          :key="timezone.utc"
          class="timezone"
          @click="toggleTimeZone($event)"
          v-bind="{timezone: timezone}"
        />
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
import WorldClockTimeZone from './WorldClockTimeZone.vue';

export default {
  data() {
    return {
      timezones: WorldClockTimeZones.LIST,
      hours: WorldClockTimeZones.HOUR_LIST,
      settings: {
        showingAll: true,
        selectedTimeZoneIds: []
      }
    };
  },
  mounted() {
    // First of all, restore settings
    this.restoreSettings();

    // Initialize timezone selections
    this.initTimeZoneSelections();

    // Settings is saved in every defined minute.
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
        if (element) {
          if (!element.classList.contains('selected')) {
            element.classList.add('selected');
          }
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
      this.settings = settings;
      console.log(`Setting restored. ${jsonStr}`);
    }
  },
  components: {
    AlertPlugin,
    WorldClockTimeZone
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
    font-size: 180%;
    font-weight: bold;
    width: 130px;
  }
  .timezone .clock {
    /*
    float: left;
    width: 200px;
    font: 120% Monaco, Consolas, monospace;
    */
    font: 200% "Digital-7";
    margin-top: 4px;
  }
  .timezone .regions {
    border: 1px solid #ccc;
    /*
    display: inline-block;
    */
    height: 40px;
    padding: 3px;
    overflow-x: hidden;
    overflow-y: scroll;
    /*
    overflow: hidden;
    width: calc(100% - 200px - 80px);
    */
    width: 100%;
    word-break: keep-all;
  }
  .timezone .regions .region-list .region {
    background-color: #999;
    margin-right: 0.5rem;
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
      font-size: 180%;
      margin-top: 0;
      width: 100%;
    }
    .timezone .regions {
      display: inline-block;
      /*
      height: 1.2em;
      overflow: hidden;
      */
      width: 100%;
    }

  }
</style>
