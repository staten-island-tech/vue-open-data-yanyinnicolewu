<template>
  <div class="container">
    <BabyCard v-for="(mon, index) in babyname" :key="index" :babyname="mon" :id="index + 1" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import BabyCard from '../components/BabyCard.vue'
const babyname = ref([])
async function getBaby() {
  try {
    const response = await fetch(
      'https://data.cityofnewyork.us/resource/25th-nujf.json?$limit=10&$offset=0',
    )
    const data = await response.json()
    baby.value = data
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
