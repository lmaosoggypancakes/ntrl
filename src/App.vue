<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import SearchMenu from './components/SearchMenu.vue';
import axios from 'axios'
const center = ref([-119.7, 39.445706])
const projection = ref('EPSG:4326')
const zoom = ref(8)
const rotation = ref(0)
const searchData = ref({})
const parks = ref([])
const shownParks = ref([])
const changeData = e => searchData.value = e
onBeforeMount(async () => {
  const response = await axios.get("https://ntrl-fbla.herokuapp.com")
  console.log(response);
  
  parks.value = response.data
})
</script>

<template>
  <div class="bg-green-200 w-screen h-screen p-2 flex flex-col font-black">
    <p class="text-3xl p-4 text-center">Find parks in your area</p>
    <div class="border-4 rounded-md border-slate-800 bg-white grid grid-cols-2 gap-2 h-full">
      <div class="my-4 border-r-2 border-r-slate-900 flex flex-col space-y-10">
        <div class="mx-2 pb-8 border-b-2 border-slate-200">
          <SearchMenu @searchChange="changeData"/>
        </div>
        <div>
          <ul>
            <li>{{ searchData }}</li>
            <li>{{ parks  }}</li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100%">
            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
            :projection="projection" />
            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>
        </ol-map>
      </div>
    </div>
  </div>
</template>

<style>
@font-face {
 font-family: Horizon;
  src: url('./assets/fonts/Horizon/horizon_outlined.otf');
}

body {
  font-family: 'Horizon';
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}




.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

</style>
