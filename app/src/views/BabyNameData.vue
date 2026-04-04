<template>
  <div v-if="baby">
    <BabyMiniPieChart :babyData="baby" />
    <h1>{{ baby.nm }}</h1>
    <h2>{{ baby.gndr }}</h2>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const baby = ref(null)
async function getBaby(id) {
  console.log('did i run?')
  const response = await fetch(
    `https://data.cityofnewyork.us/resource/25th-nujf.json?$where=id='${id}'`,
  )
  const data = await response.json()
  baby.value = data[0]
}
watch(
  () => route.params.id,
  function (id) {
    getBaby(id)
  },
)
onMounted(function () {
  getBaby(route.params.id)
})
</script>

<style scoped></style>
