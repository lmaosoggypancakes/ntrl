<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onBeforeMount } from 'vue' // vue reactivity helpers
const show = ref(false) // by default, keep the custom filters closed
const slide = computed(() => {
    return show.value ? 'slide-up': 'slide-down' // maps the on/off state of the custom filters to a CSS class that can be animated
    // here the ternary operator is used for conciseness.
})
const regions = ref<string[]>(['Northwest', 'Southern', 'Eastern'])

const searchData = reactive({
    title: '',
    region: '',
    dogabble: false,
    activities: reactive([]),
    utilities: reactive([]),
    transportation: reactive([]),
})
const changeFilters = (value: string, t: 'activities' | 'utilities' | 'transportation') => {
    const list = (searchData[t] as Array<string>)
    // if/else statement to remove a filter if it was previously in the user's search data, else remove
    if(list.includes(value)) {
        list.splice(list.indexOf(value), 1)
    } else {
        list.push(value)
    }
}
const emits = defineEmits(['searchChange'])
watch(searchData, () => emits('searchChange', searchData)) // whenever the user's search criteria changes, emit the new search data back up
// to the parent component defined in App.vue
const props = defineProps<{
    utilities: string[],
    activities: string[],
    transportation: string[]
}>()
</script>
<template>
    <form class="p-2 flex flex-col space-y-8">
        <div class="flex flex-row justify-center"> 
            <input type="text" content="Search for park names!" v-tippy class="w-full mx-8 rounded-md bg-green-200 border-2 border-slate-700 px-2 text-gray-900 placeholder:text-slate-800" v-model="searchData.title" placeholder="search for parks..."  />
            <button @click="show = !show" type="button" class="p-2 border-2 border-slate-900 rounded-md" content="Advanced filters" v-tippy>
            <!-- SVG filter icons (filled in / not filled in, depends on whether or not the extra search filters are shown.)-->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" v-if="show">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </button>
        </div>
        <transition :name="slide" class="overflow-hidden"> <!-- transition element wraps the content such that it's state transitions (open/show) can
            be animated by sliding up/down. might not work in legacy browsers or older PC's-->
            <div :class="{'hidden': show}" class="border-2 border-slate-800 rounded-md p-2 flex flex-col space-y-4">
                <div class="flex justify-between">
                    <div>
                        <label for="dogabble" class="mr-4">Pets Allowed</label>
                        <input type="checkbox" id="dogabble" v-model="searchData.dogabble"/>
                    </div>
                    <div>
                        <label for="region" class="mr-4">Region</label>
                        <select id="region" v-model="searchData.region">
                            <option  disabled selected value="">choose a region...</option>
                            <option v-for="region in regions" :value="region">{{ region }} Nevada</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-3 overflow-auto h-40">
                    <div>
                        <span class="text-center block">Activities</span>
                        <div v-for="activity in activities">
                            <label>{{ activity }}</label>
                            <input type="checkbox" :value="activity" class="float-right mr-8" @click="changeFilters(activity, 'activities')"/>
                        </div>
                    </div>
                    <div>
                        <span class="text-center block">Utilities</span>
                        <div v-for="utility in utilities">
                            <label>{{ utility }}</label>
                            <input type="checkbox" :value="utility" class="float-right mr-8" @click="changeFilters(utility, 'utilities')"/>
                        </div>
                    </div>
                    <div>
                        <span class="text-center block">Transportation</span>
                        <div v-for="t in transportation">
                            <label>{{ t }}</label>
                            <input type="checkbox" :value="t" class="float-right mr-8" @click="changeFilters(t, 'transportation')"/>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </form>
</template>