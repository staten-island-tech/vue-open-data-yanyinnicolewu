<template>
  <div class="container">
    <BabyCard v-for="(baby, index) in babyname" :key="baby.name" :babyname="baby" :id="index + 1" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import BabyCard from '../components/BabyCard.vue'
const baby = ref([])
async function getBaby() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/resource/25th-nujf.json')
    const data = await response.json()
    baby.value = data.results
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
