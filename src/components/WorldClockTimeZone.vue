<template>
  <div
    :id="timezone.utc"
    class="timezone"
    :style="{background: color}"
  >
    <div class="utc">UTC {{ timezone.utc }}</div>
    <div class="clock">{{ datetime }}</div>
    <div class="regions">
      <span class="region-list">
        <span v-for="(region, index) in timezone.regions" :key="index" class="region">
          {{ region }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { DateTime } from 'luxon'
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js'

export default {
  props: {
    timezone: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const datetime = ref('2022-01-01 00:00:00.123')
    const color = ref('white')

    onMounted(() => {
      const counter = () => {
        const date = DateTime
          .local()
          .toUTC(props.timezone.offsetMin)

        const targetTime = date.toFormat('HHmm')
        const dateStr = date.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS')

        datetime.value = dateStr
        color.value = WorldClockTimeZones.findColor(targetTime)

        setTimeout(counter, 1)
      }
      counter()
    })

    return {
      datetime,
      color
    }
  }
}
</script>

<style scoped>
</style>
