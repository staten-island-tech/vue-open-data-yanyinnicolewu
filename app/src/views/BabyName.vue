<template>
  <div>
    <h1>NYC Baby Name Dashboard</h1>

    <div class="tabs">
      <button @click="tab = 'race'">Race Distribution</button>
      <button @click="tab = 'frequency'">Baby born each year</button>
      <button @click="tab = 'top'">Top Names</button>
    </div>

    <div v-if="tab === 'cards'" class="container">
      <BabyCard v-for="(baby, index) in babyname" :key="index" :baby="baby" />
    </div>

    <!-- TAB 2: RACE CHART -->
    <div v-if="tab === 'race'">
      <RaceChart :data="babyname" />
    </div>

    <!-- TAB 3: GENDER CHART -->
    <div v-if="tab === 'gender'">
      <GenderChart :data="babyname" />
    </div>

    <!-- TAB 4: TOP NAMES -->
    <div v-if="tab === 'top'">
      <TopNamesChart :data="babyname" />
    </div>

    <div class="container">
      <BabyCard v-for="(baby, index) in babyname" :key="index" :baby="baby" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BabyCard from '../components/BabyCard.vue'

const babyname = ref([])

async function getBaby() {
  try {
    const response = await fetch(
      'https://data.cityofnewyork.us/resource/25th-nujf.json?$limit=100&$offset=0',
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
