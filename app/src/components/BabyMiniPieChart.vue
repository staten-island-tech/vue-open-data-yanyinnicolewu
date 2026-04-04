<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps({
  id: { type: [Number, String], required: true },
})

const canvas = ref(null)
let chart = null

async function getRaceData(id) {
  const response = await fetch(
    `https://data.cityofnewyork.us/resource/25th-nujf.json?$where=id='${id}'`,
  )
  const data = await response.json()
  if (!data[0]) return {}

  const race = data[0].ethcty || 'Unknown'
  const count = parseInt(data[0].cnt) || 1
  return { [race]: count }
}

async function renderChart() {
  const races = await getRaceData(props.id)
  if (!races) return

  if (chart) chart.destroy()

  chart = new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: Object.keys(races),
      datasets: [
        {
          data: Object.values(races),
          backgroundColor: ['#FFD700', '#000', '#FF6347', '#4682B4', '#32CD32', '#FF69B4'],
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
    },
  })
}

onMounted(() => renderChart())
watch(
  () => props.id,
  () => renderChart(),
)
</script>
