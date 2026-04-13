<template>
  <div v-if="baby" class="card">
    <h1>{{ baby.nm }}</h1>
    <h2>{{ baby.gndr }}</h2>

    <p>Year: {{ baby.brth_yr }}</p>
    <p>Race/Ethnicity: {{ baby.ethcty }}</p>
    <p>Rank: {{ baby.rnk }}</p>
    <p>Count: {{ baby.cnt }}</p>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const baby = ref(null)

async function getBaby(nm) {
  console.log('did i run?')
  const response = await fetch(
    `https://data.cityofnewyork.us/resource/25th-nujf.json?$where=nm='${nm}'`,
  )
  const data = await response.json()
  baby.value = data[0]
}
watch(
  () => route.params.nm,
  function (nm) {
    getBaby(nm)
  },
)
onMounted(function () {
  getBaby(route.params.nm)
})
</script>

<style scoped></style>
