<template>
  <div class="chart-container">
    <h1>NYC Babies Born Per Year</h1>
    <p class="status">{{ status }}</p>
    <div class="legend">
      <span class="legend-item">
        <span class="legend-dot"></span>
        Total births recorded
      </span>
    </div>
    <div class="chart-wrapper">
      <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const loaded = ref(false)
const status = ref('Loading data...')

const chartData = ref({ labels: [], datasets: [] })

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ' ' + ctx.parsed.y.toLocaleString() + ' babies',
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        autoSkip: false,
        maxRotation: 45,
        color: '#888',
        font: { size: 12 },
      },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.07)' },
      ticks: {
        color: '#888',
        font: { size: 12 },
        callback: (v) => v.toLocaleString(),
      },
    },
  },
}

async function fetchAll() {
  const base = 'https://data.cityofnewyork.us/resource/25th-nujf.json'
  const pageSize = 5000
  let offset = 0
  let all = []

  while (true) {
    const res = await fetch(`${base}?$limit=${pageSize}&$offset=${offset}`)
    const data = await res.json()
    if (!data.length) break
    all = all.concat(data)
    if (data.length < pageSize) break
    offset += pageSize
  }

  return all
}

onMounted(async () => {
  try {
    const data = await fetchAll()

    const totals = {}
    for (const row of data) {
      const yr = row.brth_yr
      const cnt = parseInt(row.cnt, 10) || 0
      totals[yr] = (totals[yr] || 0) + cnt
    }

    const years = Object.keys(totals).sort()
    const counts = years.map((y) => totals[y])

    status.value = `Data from ${years[0]}–${years[years.length - 1]} · ${data.length.toLocaleString()} records`

    chartData.value = {
      labels: years,
      datasets: [
        {
          label: 'Babies born',
          data: counts,
          backgroundColor: '#378ADD',
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }

    loaded.value = true
  } catch (e) {
    status.value = 'Failed to load data: ' + e.message
  }
})
</script>

<style scoped>
.chart-container {
  font-family: sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}

.status {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
}

.legend {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: #378add;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 360px;
}
</style>
