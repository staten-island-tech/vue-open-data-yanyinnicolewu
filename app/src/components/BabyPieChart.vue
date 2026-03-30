<template>
  <div v-if="chartData">
    <canvas ref="pieChart"></canvas>
  </div>
  <div v-else>Loading chart...</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps({
  babyData: { type: Object, required: true }, // expects the baby object
})

const pieChart = ref(null)
let chartInstance = null

// Prepare chart data
function getChartData(baby) {
  // Replace these field names if your dataset uses different race keys
  const labels = ['White', 'Black', 'Hispanic', 'Asian', 'Other']
  const values = [
    baby.boy_white || 0,
    baby.boy_black || 0,
    baby.boy_hispanic || 0,
    baby.boy_asian || 0,
    baby.boy_other || 0,
  ]

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  }
}

// Watch for changes in babyData
watch(
  () => props.babyData,
  (newVal) => {
    if (!newVal) return

    const data = getChartData(newVal)

    // Destroy previous chart if exists
    if (chartInstance) chartInstance.destroy()

    // Create new chart
    chartInstance = new Chart(pieChart.value.getContext('2d'), {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
            },
          },
        },
      },
    })
  },
  { immediate: true },
)
</script>

<style scoped>
canvas {
  max-width: 500px;
  margin: auto;
}
</style>
