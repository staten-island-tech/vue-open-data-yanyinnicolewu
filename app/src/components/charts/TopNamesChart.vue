<template>
  <div class="chart-container">
    <h1>Top Baby Names in NYC by Year</h1>
    <p class="status">{{ status }}</p>

    <div class="controls" v-if="loaded">
      <div class="control-group">
        <label for="year-select">Year</label>
        <select id="year-select" v-model="selectedYear" @change="updateChart">
          <option v-for="yr in years" :key="yr" :value="yr">{{ yr }}</option>
        </select>
      </div>

      <div class="control-group">
        <label for="gender-select">Gender</label>
        <select id="gender-select" v-model="selectedGender" @change="updateChart">
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
        </select>
      </div>

      <div class="control-group">
        <label for="top-select">Top</label>
        <select id="top-select" v-model="topN" @change="updateChart">
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
      </div>
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
const years = ref([])
const selectedYear = ref(null)
const selectedGender = ref('FEMALE')
const topN = ref(10)
const allData = ref({})

const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({})

function getColor(gender) {
  return gender === 'FEMALE' ? '#D4537E' : '#378ADD'
}

function buildOptions(gender) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} babies`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#888',
          font: { size: 12 },
          autoSkip: false,
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
  const key = `${selectedYear.value}_${selectedGender.value}`
  const nameMap = allData.value[key] || {}

  const sorted = Object.entries(nameMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN.value)

  const labels = sorted.map(([name]) => name)
  const counts = sorted.map(([, cnt]) => cnt)
  const color = getColor(selectedGender.value)

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Babies',
        data: counts,
        backgroundColor: color,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  chartOptions.value = buildOptions(selectedGender.value)
}

onMounted(async () => {
  try {
    const data = await fetchAll()

    // Group: "year_gender" -> name -> total count
    const grouped = {}
    for (const row of data) {
      const key = `${row.brth_yr}_${row.gndr}`
      const name = row.nm
      const cnt = parseInt(row.cnt, 10) || 0
      if (!grouped[key]) grouped[key] = {}
      grouped[key][name] = (grouped[key][name] || 0) + cnt
    }

    allData.value = grouped

    const uniqueYears = [...new Set(data.map((r) => r.brth_yr))].sort()
    years.value = uniqueYears
    selectedYear.value = uniqueYears[uniqueYears.length - 1]

    status.value = `${uniqueYears.length} years of data · ${data.length.toLocaleString()} records`

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
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  color: #555;
}

.control-group select {
  font-size: 14px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
