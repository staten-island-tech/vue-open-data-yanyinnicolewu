<template>
  <router-link :to="babyPath" class="card">
    <h2>{{ babyname.nm }}</h2>
    <h3>{{ babyname.gndr }}</h3>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  babyname: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  babyData: {
    type: Object,
    required: true,
  },
})

const babyPath = computed(() => {
  return `/babyPath/${props.babyname.id}`
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
