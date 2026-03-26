<template>
  <div>
    <h1>{{ baby.name }}</h1>
    <h2>{{ baby.gender }}</h2>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const baby = ref(null)
async function getBaby(id) {
  console.log('did i run?')
  const response = await fetch('https://data.cityofnewyork.us/resource/25th-nujf.json')
  const data = await response.json()
  baby.value = data
}
watch()
</script>

<style lang="scss" scoped></style>
