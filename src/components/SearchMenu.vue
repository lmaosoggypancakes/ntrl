<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
const show = ref(false)
const slide = computed(() => {
    return show.value ? 'slide-up': 'slide-down'
})
const regions = ['Northwest', 'Southern', 'Eastern']
const filters = {
    length: 3,
    utilities: ['Restrooms', 'Water Fountains', 'Showers'],
    activites: ['Fishing', 'Soccer', 'Basketball'],
    transportation: ['Biking', 'Skating', 'Horseback']    
}

const searchData = reactive({
    name: '',
    region: 'Northwest',
    dogabble: false,
    activities: reactive(filters.activites.reduce((acc, curr) => (acc[curr] = false, acc), {} as any)),
    utilities:  reactive(filters.utilities.reduce((acc, curr) => (acc[curr] = false, acc), {} as any)),
    transportation: reactive(filters.transportation.reduce((acc, curr) => (acc[curr] = false, acc), {} as any)),
})
const emits = defineEmits(['searchChange'])
watch(searchData, () => emits('searchChange', searchData))
</script>
<template>
    <form class="p-2 flex flex-col space-y-8">
        <div class="flex flex-row justify-center">
            <input type="text" class="w-full mx-8 rounded-md bg-green-200 border-2 border-slate-700 px-2 text-gray-900" v-model="searchData.name" placeholder="search for parks..."  />
            <button @click="show = !show" type="button" class="p-2 border-2 border-slate-900 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" v-if="show">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </button>
        </div>
        <transition :name="slide">
            <div v-if="show" class="border-2 border-slate-800 rounded-md p-2 flex flex-col">
                <div class="flex justify-between">
                    <div>
                        <label for="dogabble" class="mr-4">Pets Allowed</label>
                        <input type="checkbox" id="dogabble" v-model="searchData.dogabble"/>
                    </div>
                    <div>
                        <label for="region" class="mr-4">Region</label>
                        <select id="region" v-model="searchData.region">
                            <option v-for="region in regions" :value="region">{{ region }} Nevada</option>
                        </select>
                    </div>
                </div>
                <div>
                    <table class="w-full">
                        <tr>
                            <th>Utilities</th>
                            <th>Activities</th>
                            <th>Transportation</th>
                        </tr>
                        <tr class="text-xs w-1/2" v-for="i in filters.length">
                            <th class="">{{ filters.utilities[i-1] }}<input type="checkbox" @click="searchData.utilities[filters.utilities[i-1]] = !searchData.utilities[filters.utilities[i-1]]"></th>
                            <th class="">{{ filters.activites[i-1] }}<input type="checkbox" @click="searchData.activities[filters.activites[i-1]] = !searchData.activities[filters.activites[i-1]]"></th>
                            <th class="">{{ filters.transportation[i-1] }}<input type="checkbox" @click="searchData.transportation[filters.transportation[i-1]] = !searchData.transportation[filters.transportation[i-1]]"></th>
                        </tr>
                    </table>
                </div>
            </div>
        </transition>
    </form>
</template>