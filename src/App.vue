<script setup>
const API_URL = "http://localhost:8000";
import axios from "axios";
import { onBeforeMount, ref } from "vue";
const selectedParkId = ref();
const allParks = ref([]);
</script>

<template>
  <div class="h-screen w-screen bg-stone-800">
    <router-view></router-view>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
