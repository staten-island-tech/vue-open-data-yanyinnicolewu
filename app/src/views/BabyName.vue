<template>
  <div>
    <h1>NYC Baby Name Dashboard</h1>

    <div class="tabs">
      <button @click="tab = 'home'">Home</button>
      <button @click="tab = 'race'">Race Distribution</button>
      <button @click="tab = 'year'">Babies Born Each Year</button>
      <button @click="tab = 'top'">Top Names</button>
    </div>

    <div v-if="tab === 'home'" class="container">
      <BabyCard v-for="(baby, index) in babyname" :key="index" :baby="baby" />
    </div>

    <div v-if="tab === 'race'">
      <RaceChart :data="babyname" />
    </div>

    <div v-if="tab === 'year'">
      <BabiesByYear :data="babyname" />
    </div>

    <div v-if="tab === 'top'">
      <TopNamesChart :data="babyname" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BabyCard from '../components/BabyCard.vue'
import BabiesByYear from '@/components/charts/BabiesByYear.vue'
import RaceChart from '@/components/charts/RaceChart.vue'
import TopNamesChart from '@/components/charts/TopNamesChart.vue'

const babyname = ref([])
const tab = ref('home')

async function getBaby() {
  try {
    const response = await fetch(
      'https://data.cityofnewyork.us/resource/25th-nujf.json?$limit=10000&$offset=0',
    )
    const data = await response.json()
    babyname.value = data
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getBaby()
})
</script>

<style scoped>
.container {
  width: 80vw;
  margin: 30px auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
