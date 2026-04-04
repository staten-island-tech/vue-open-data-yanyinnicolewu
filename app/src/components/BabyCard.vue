<template>
  <router-link :to="babyPath" class="card">
    <h2>{{ baby.nm }}</h2>
    <h3>{{ baby.gndr }}</h3>
    <BabyMiniPieChart :id="baby.id" />
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import BabyMiniPieChart from './BabyMiniPieChart.vue'

const props = defineProps({
  baby: {
    type: Object,
    required: true,
  },
})

const babyPath = computed(() => {
  return `/babyPath/${props.baby.id}`
})
</script>

<style scoped>
.card {
  width: 28%;
  height: 500px;
  background-color: aliceblue;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  text-transform: uppercase;
}
img {
  width: 100%;
  height: 80%;
  object-fit: cover;
}
</style>
