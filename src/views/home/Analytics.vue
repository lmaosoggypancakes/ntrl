<template>
  <div class="w-full h-full p-4">
    <div
      class="w-full h-full border-2 border-white rounded-xl grid grid-rows-2"
      v-if="!loading"
      v-motion
      :initial="{
        opacity: 0,
        y: 100,
      }"
      :enter="{
        opacity: 1,
        y: 0,
      }"
    >
      <div class="grid grid-cols-2 border-b-2 border-b-white">
        <div
          class="relative overflow-hidden"
          :class="{
            'col-span-2': !showActivePark,
            'col-span-1': showActivePark,
          }"
        >
          <v-chart
            @click="goToPark"
            autoresize
            class="chart"
            :option="chartOptions"
            v-if="showChart"
          />
        </div>
        <div class="relative border-l-2 border-white" v-if="showActivePark">
          <button
            class="absolute bg-primary hover:bg-primary-focus text-black p-2 right-0 rounded-xl z-10"
            @click="closeActivePark()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <v-chart autoresize class="chart" :option="activeParkChartOptions" />
        </div>
      </div>
      <div class="grid grid-cols-4 overflow-hidden">
        <div class="col-span-3 overflow-auto p-4">
          <li
            v-for="park in parks"
            class="bg-neutral hover:bg-[#292524] list-none p-4 rounded-md flex flex-row justify-between items-center"
            @click="togglePark(park.id)"
          >
            <span>{{ park.title }}</span>
            <div>
              <router-link
                class="float-right p-1 border-2 border-primary rounded-md hover:bg-primary hover:text-neutral"
                :to="'/edit/' + park.id"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </router-link>
              <span class="float-right mr-2"
                >{{ park.visits.length }} visits</span
              >
            </div>
          </li>
        </div>
        <div class="border-l-2 border-l-white col-span-1">
          <img src="../../assets/logo.png" alt="" />
        </div>
      </div>
    </div>
    <div v-else class="w-full h-full flex justify-center items-center">
      <loader :active="loading" opacity="0.15" color="#F28C18"></loader>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed, watch, reactive } from "vue";
import { getParks } from "../../api";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
const parks = ref([]);
const toast = useToast();
const router = useRouter();
const activeParkId = ref(41);
const loading = ref(true);
const showActivePark = ref(false);
const activeParkVisitDates = computed(() => {
  return parks.value
    .find((park) => park.id == activeParkId.value)
    .visits.map((v) => v.visited);
});
const activeParkVisits = computed(() => {
  const cummulative = [
    ...Array(
      parks.value.find((park) => park.id == activeParkId.value).visits.length
    ).keys(),
  ].map((i) => i + 1);
  return cummulative;
});

const activeParkChartData = computed(() => {
  const points = [];
  activeParkVisits.value.forEach((v, i) => {
    points.push([new Date(activeParkVisitDates.value[i]).valueOf(), v]);
  });
  return points;
});
const activeParkChartOptions = computed(() => {
  return {
    color: ["#F28C18"],
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      min: activeParkChartData.value[0][0],
      max: activeParkChartData.value[activeParkChartData.value.length - 1],
    },

    yAxis: {},
    series: [
      {
        data: activeParkChartData.value,
        type: "line",
        smooth: false,
      },
    ],
    title: {
      text:
        "Visits for " +
        parks.value.find((p) => p.id == activeParkId.value).title,
      x: "center",
    },
    scales: {
      x: { type: "linear" },
      y: { type: "linear" },
    },
  };
});
const showChart = ref(false);
const chartOptions = ref({});

onBeforeMount(async () => {
  const response = await getParks();
  if (!response) toast.error("Parks not found");
  parks.value = response.data;
  parks.value.sort((a, b) => b.visits.length - a.visits.length);
  chartOptions.value = {
    title: {
      text: "All Parks",
      x: "center",
    },
    color: ["#F28C18"],
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} visits",
    },
    xAxis: {
      data: parks.value.map((park) => park.title).slice(0, 10), // get only the top 10, and return the title of each
    },
    yAxis: {},
    series: [
      {
        type: "bar",
        data: parks.value.map((park) => park.visits.length).slice(0, 10),
      },
    ],
  };
  loading.value = false;
  showChart.value = true;
});
const togglePark = (id) => {
  activeParkId.value = id;
  showActivePark.value = true;
};

const closeActivePark = () => {
  showActivePark.value = false;
};

const goToPark = (params) => {
  const park = parks.value.find((p) => p.title == params.name);
  router.push(`/edit/${park.id}`);
};

// data functions
</script>
