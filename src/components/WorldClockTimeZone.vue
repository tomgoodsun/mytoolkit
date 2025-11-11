<template>
  <div
    :id="timezone.utc"
    class="timezone"
    :class="{ selected: isSelected }"
    :style="{ background: color }"
    @click="$emit('toggle')"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { DateTime } from 'luxon'
import WorldClockTimeZones from '../libraries/WorldClockTimeZones.js'

export default {
  props: {
    timezone: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle'],
  setup(props) {
    const datetime = ref('2022-01-01 00:00:00.123')
    const color = ref('white')
    let timerId = null

    const updateTime = () => {
      const date = DateTime
        .local()
        .toUTC(props.timezone.offsetMin)

      const targetTime = date.toFormat('HHmm')
      const dateStr = date.toFormat('yyyy-LL-dd (ccc) HH:mm:ss.SSS')

      datetime.value = dateStr
      color.value = WorldClockTimeZones.findColor(targetTime)
    }

    onMounted(() => {
      updateTime()
      timerId = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timerId) {
        clearInterval(timerId)
      }
    })

    return {
      datetime,
      color
    }
  }
}
</script>

<style scoped>
.timezone {
  border: 3px solid #fff;
  color: #fff;
  margin: 0 0 0.5rem 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.timezone.selected {
  border: 3px solid rgb(255, 153, 0);
}

.utc {
  float: left;
  font-size: 180%;
  font-weight: bold;
  width: 130px;
}

.clock {
  font: 200% "Digital-7";
  margin-top: 4px;
}

.regions {
  border: 1px solid #ccc;
  height: 40px;
  padding: 3px;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  word-break: keep-all;
}

.regions .region-list .region {
  background-color: #999;
  margin-right: 0.5rem;
}

@media screen and (max-width: 480px) {
  .timezone {
    margin: 0 0 1em 0;
  }
  .utc {
    float: none;
    font-size: 150%;
    width: 100%;
  }
  .clock {
    float: none;
    font-size: 180%;
    margin-top: 0;
    width: 100%;
  }
  .regions {
    display: inline-block;
    width: 100%;
  }
}
</style>
