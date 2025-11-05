<template>
  <BRow>
    <BCol col lg="12" md="12" sm="12">
      <div id="timezone-filter">
        <BButton
          variant="light"
          size="md"
          class="filter"
          alt="Show selected"
          @click="toggleFilter"
        >
          <svg v-show="!settings.showingAll" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-circle-fill on" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
          </svg>
          <svg v-show="settings.showingAll" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-circle off" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
          </svg>
        </BButton>
      </div>

      <BAlert variant="info" :model-value="true">
        Selected time zones are save in Cookie of your browser.
      </BAlert>

      <div id="timezone-list">
        <WorldClockTimeZone
          v-for="timezone in timezones"
          :key="timezone.utc"
          class="timezone"
          @click="toggleTimeZone"
          :timezone="timezone"
        />
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { BRow, BCol, BButton, BAlert } from 'bootstrap-vue-next'
import Cookies from 'js-cookie'
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js'
import WorldClockTimeZone from './WorldClockTimeZone.vue'

export default {
  components: {
    BRow,
    BCol,
    BButton,
    BAlert,
    WorldClockTimeZone
  },
  setup() {
    const timezones = ref(WorldClockTimeZones.LIST)
    const hours = ref(WorldClockTimeZones.HOUR_LIST)
    const settings = reactive({
      showingAll: true,
      selectedTimeZoneIds: []
    })

    const toggleFilter = () => {
      settings.showingAll = !settings.showingAll
      toggleDisplayOfTimeZones()
      saveSettings()
    }

    const toggleTimeZone = (evt) => {
      let element = evt.target
      while (!element.classList.contains('timezone')) {
        if (element.tagName === 'BODY') {
          break
        }
        element = element.parentNode
      }
      element.classList.toggle('selected')
      saveSettings()
    }

    const initTimeZoneSelections = () => {
      settings.selectedTimeZoneIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element && !element.classList.contains('selected')) {
          element.classList.add('selected')
        }
      })
      toggleDisplayOfTimeZones()
    }

    const toggleDisplayOfTimeZones = () => {
      document
        .querySelectorAll('#timezone-list .timezone')
        .forEach((element) => {
          if (settings.showingAll) {
            element.style.display = 'block'
          } else {
            element.style.display = element.classList.contains('selected') ? 'block' : 'none'
          }
        })
    }

    const saveSettings = () => {
      settings.selectedTimeZoneIds = []
      document
        .querySelectorAll('#timezone-list .selected')
        .forEach((element) => {
          settings.selectedTimeZoneIds.push(element.id)
        })

      const jsonStr = JSON.stringify(settings)
      Cookies.set(
        'world-clock-settings',
        jsonStr,
        {
          expires: 7,
          path: location.pathname
        }
      )
      console.log(`Setting saved. ${jsonStr}`)
    }

    const restoreSettings = () => {
      const jsonStr = Cookies.get('world-clock-settings')
      if (jsonStr !== undefined) {
        const restoredSettings = JSON.parse(jsonStr)
        settings.showingAll = restoredSettings.showingAll
        settings.selectedTimeZoneIds = restoredSettings.selectedTimeZoneIds
      }
      console.log(`Setting restored. ${jsonStr}`)
    }

    onMounted(() => {
      restoreSettings()
      initTimeZoneSelections()
      setInterval(saveSettings, 60000)
    })

    return {
      timezones,
      hours,
      settings,
      toggleFilter,
      toggleTimeZone
    }
  }
}
</script>

<style scoped>
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
  }
  .timezone :deep(.utc) {
    float: left;
    font-size: 180%;
    font-weight: bold;
    width: 130px;
  }
  .timezone :deep(.clock) {
    font: 200% "Digital-7";
    margin-top: 4px;
  }
  .timezone :deep(.regions) {
    border: 1px solid #ccc;
    height: 40px;
    padding: 3px;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    word-break: keep-all;
  }
  .timezone :deep(.regions .region-list .region) {
    background-color: #999;
    margin-right: 0.5rem;
  }

  @media screen and (max-width: 480px) {
    .timezone {
      margin: 0 0 1em 0;
    }
    .timezone :deep(.utc) {
      float: none;
      font-size: 150%;
      width: 100%;
    }
    .timezone :deep(.clock) {
      float: none;
      font-size: 180%;
      margin-top: 0;
      width: 100%;
    }
    .timezone :deep(.regions) {
      display: inline-block;
      width: 100%;
    }
  }
</style>
