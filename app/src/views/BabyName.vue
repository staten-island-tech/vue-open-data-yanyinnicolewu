<template>
  <div class="container">
    <BabyCard v-for="(baby, index) in babyname" :key="baby.name" :babyname="baby" :id="index + 1" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import BabyCard from '../components/BabyCard.vue'
</script>

<style scoped></style>
