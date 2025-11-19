<template>
  <BRow>
    <BCol cols="12">
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
          v-for="timezone in filteredTimezones"
          :key="timezone.utc"
          :timezone="timezone"
          :is-selected="selectedTimeZoneIds.includes(timezone.utc)"
          @toggle="toggleTimeZone(timezone.utc)"
        />
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
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
    const showingAll = ref(true)
    const selectedTimeZoneIds = ref([])

    const settings = computed(() => ({
      showingAll: showingAll.value,
      selectedTimeZoneIds: selectedTimeZoneIds.value
    }))

    const filteredTimezones = computed(() => {
      if (showingAll.value) {
        return timezones.value
      }
      return timezones.value.filter(tz => selectedTimeZoneIds.value.includes(tz.utc))
    })

    const toggleFilter = () => {
      showingAll.value = !showingAll.value
      saveSettings()
    }

    const toggleTimeZone = (utc) => {
      const index = selectedTimeZoneIds.value.indexOf(utc)
      if (index > -1) {
        selectedTimeZoneIds.value.splice(index, 1)
      } else {
        selectedTimeZoneIds.value.push(utc)
      }
      saveSettings()
    }

    const saveSettings = () => {
      const jsonStr = JSON.stringify(settings.value)
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
        try {
          const restoredSettings = JSON.parse(jsonStr)
          showingAll.value = restoredSettings.showingAll
          selectedTimeZoneIds.value = restoredSettings.selectedTimeZoneIds || []
          console.log(`Setting restored. ${jsonStr}`)
        } catch (e) {
          console.error('Failed to restore settings', e)
        }
      }
    }

    // Auto-save every minute
    onMounted(() => {
      restoreSettings()
      setInterval(saveSettings, 60000)
    })

    return {
      timezones,
      filteredTimezones,
      settings,
      selectedTimeZoneIds,
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
</style>
