<template>
  <div class="w-full h-full p-4">
    <div
      class="w-full h-full border-2 border-white rounded-xl grid grid-rows-2"
    >
      <div class="border-2 border-white grid grid-cols-2">
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
        <div class="border-2 border-white relative" v-if="showActivePark">
          <button
            class="absolute bg-yellow-200 text-black p-2 right-0 rounded-sm"
            @click="closeActivePark()"
          >
            X
          </button>
          <v-chart autoresize class="chart" :option="activeParkChartOptions" />
        </div>
      </div>
      <div class="grid grid-cols-4 overflow-hidden">
        <div class="col-span-3 overflow-auto">
          <li
            v-for="park in parks"
            class="bg-slate-500 hover:bg-gray-600"
            @click="togglePark(park.id)"
          >
            {{ park.title }} - {{ park.visits.length }}
          </li>
        </div>
        <div class="border-2 border-white col-span-1">
          <img src="../../assets/logo.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed, watch, reactive } from "vue";
import { getParks } from "../../api";
import { useRouter } from "vue-router";
const parks = ref([]);
const router = useRouter();
const activeParkId = ref(41);

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
  console.log(points);
  return points;
});
const activeParkChartOptions = computed(() => {
  return {
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
        smooth: true,
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
  if (!response) alert("Parks not found");
  parks.value = response.data;
  parks.value.sort((a, b) => b.visits.length - a.visits.length);
  console.log(parks.value.map((park) => park.title));

  chartOptions.value = {
    title: {
      text: "All Parks",
      x: "center",
    },
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
  const park = parks.value.find((p) => (p.title = params.name));
  console.log(park.visits);
  router.push(`/edit/${park.id}`);
};

// data functions
</script>
