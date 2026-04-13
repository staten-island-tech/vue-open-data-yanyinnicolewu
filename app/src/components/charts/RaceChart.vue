<template>
  <div class="chart-container">
    <h1>NYC Baby Race Distribution by Year</h1>
    <p class="status">{{ status }}</p>

    <div class="controls" v-if="loaded">
      <label for="year-select">Select Year</label>
      <select id="year-select" v-model="selectedYear" @change="updateChart">
        <option v-for="yr in years" :key="yr" :value="yr">{{ yr }}</option>
      </select>
    </div>

    <div class="legend" v-if="loaded">
      <span v-for="(label, i) in chartData.labels" :key="label" class="legend-item">
        <span class="legend-dot" :style="{ background: backgroundColors[i] }"></span>
        {{ label }}
      </span>
    </div>

    <div class="chart-wrapper">
      <Pie v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const loaded = ref(false)
const status = ref('Loading data...')
const years = ref([])
const selectedYear = ref(null)
const allData = ref({})

const backgroundColors = [
  '#378ADD',
  '#1D9E75',
  '#D85A30',
  '#D4537E',
  '#BA7517',
  '#7F77DD',
  '#639922',
  '#E24B4A',
  '#888780',
]

const chartData = ref({ labels: [], datasets: [] })

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = ((ctx.parsed / total) * 100).toFixed(1)
          return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} (${pct}%)`
        },
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

function updateChart() {
  const yearData = allData.value[selectedYear.value] || {}
  const labels = Object.keys(yearData).sort()
  const counts = labels.map((l) => yearData[l])

  chartData.value = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  }
}

onMounted(async () => {
  try {
    const data = await fetchAll()

    // Group: year -> ethnicity -> total count
    const grouped = {}
    for (const row of data) {
      const yr = row.brth_yr
      const race = row.ethcty
      const cnt = parseInt(row.cnt, 10) || 0
      if (!grouped[yr]) grouped[yr] = {}
      grouped[yr][race] = (grouped[yr][race] || 0) + cnt
    }

    allData.value = grouped
    years.value = Object.keys(grouped).sort()
    selectedYear.value = years.value[years.value.length - 1]

    status.value = `Showing ${years.value.length} years of data · ${data.length.toLocaleString()} records`

    updateChart()
    loaded.value = true
  } catch (e) {
    status.value = 'Failed to load data: ' + e.message
  }
})
</script>

<style scoped>
.chart-container {
  font-family: sans-serif;
  max-width: 700px;
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

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.controls label {
  font-size: 14px;
  color: #555;
}

.controls select {
  font-size: 14px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #555;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
