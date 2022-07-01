<script setup lang="ts">
// import the Park type declared in ~/src/types.ts that declares the properties of each park
import { Park } from "./types";
import { saveAs } from "file-saver";
// import utilities from the Vue.js reactivity system. ref() wraps a primitive value in a proxy, allowing for declarative programming
// and automatic updating of the UI.
import { onBeforeMount, ref } from "vue";
import SearchMenu from "./components/SearchMenu.vue";
import { jsPDF } from "jspdf";
// SearchMenu is the component that handles searching for parks based on filters. Its code is in another file for a tree-like structure of components
// benefits: easier to debug and more human readable.
import axios from "axios"; // HTTP request library used for getting data of the parks
// map configuration required by the vue3-openlayers library.
// for more information: https://vue3openlayers.netlify.app/
const hoveredParkId = ref<number>(0); // helps keep track of the current park that is being hovered over
const mapCenter = ref([-119.7, 39.445706]);
const mapProjection = ref("EPSG:4326");
const mapZoom = ref(8);
const mapRotation = ref(0);
// default user search inputs, a.k.a. show all parks
const searchData = ref({
  title: "",
  region: "",
});

const allParks = ref<Park[]>([]);
const allUtilities = ref<string[]>([]);
const allTransportations = ref<string[]>([]);
const allActivities = ref<string[]>([]);

const changeData = (newParkSearchData: Park) => {
  // this function is run whenever the child SearchMenu.vue component emits new data back up to this parent
  // component. It updates the shown parks both on the list and on the map as icons.
  searchData.value = newParkSearchData;
  // filter all parks based on whether or not they meet the specified criteria in the new search data
  shownParks.value = allParks.value.filter((park) => {
    const containsName = park.title
      .toLowerCase()
      .includes(newParkSearchData.title.toLowerCase()); // normalize everything to lowercase to search for parks easier (no need to capitalize, more convenient user experience)
    // The next 3 lines use JavaScript Array methods for making sure that every park in the database has (at least) the activities, utilities, and transportation methods specified by the user
    // Array.prototype.every() is a method that determines whether all members of an array pass a certain condition
    // example:
    // let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // let isAllEven = numbers.every(number => number % 2 == 0)
    // console.log(isAllEven) -> false
    const containsActivities = newParkSearchData.activities.every((activity) =>
      park.activities.includes(activity)
    );
    const containsUtilities = newParkSearchData.utilities.every((utility) =>
      park.utilities.includes(utility)
    );
    const containsTransportation = newParkSearchData.transportation.every(
      (transportation) => park.transportation.includes(transportation)
    );

    // if the user selected that they only want parks with dogs allowed, then we will only display such parks.
    // if it is not selected, then it doesn't mean that they don't want parks where dogs are allowed,
    // it just doesn't matter.
    // therefore an if-else statement is incorporated to make this distinction.
    const isWithinFilters =
      containsName &&
      containsActivities &&
      containsTransportation &&
      containsUtilities;
    if (newParkSearchData.dogabble) {
      return newParkSearchData.region.length == 0
        ? isWithinFilters && park.dogabble
        : isWithinFilters &&
            park.dogabble &&
            park.region == newParkSearchData.region;
    } else {
      return newParkSearchData.region.length == 0
        ? isWithinFilters
        : isWithinFilters && park.region == newParkSearchData.region;
    }
  });
};

const saveData = async () => {
  const doc = new jsPDF("p", "pt", "a4");
  const PAGE_HEIGHT = 842;
  const font1 = await (
    await axios.get("/src/assets/fonts/AirbnbCereal_W_Md.otf")
  ).data;
  const font2 = await (
    await axios.get("/src/assets/fonts/AirbnbCereal_W_Bd.otf")
  ).data;
  doc.addFileToVFS("Cereal.otf", font1);
  doc.addFileToVFS("Cereal Bold.otf", font2);
  doc.addFont("Cereal.otf", "Cereal", "normal");
  doc.addFont("Cereal Bold.otf", "Cereal Bold", "normal");
  doc.setFont("Cereal");
  doc.setFontSize(9);
  let y = 10;
  shownParks.value.forEach((park) => {
    let text = "";
    doc.setFont("Cereal Bold");
    text += `${park.title} - ${park.region} Nevada\n`;
    doc.text(text, 10, y);
    text = "";
    doc.setFont("Cereal");
    text += `Activities: `;
    park.activities.forEach((a) => (text += `${a}, `));
    if (park.activities.length == 0) text += "None";
    text += "\n";
    text += `Transportation: `;
    park.transportation.forEach((a) => (text += `${a}, `));
    if (park.transportation.length == 0) text += "None";
    text += "\n";
    text += `Utilities: `;
    park.utilities.forEach((a) => (text += `${a}, `));
    if (park.utilities.length == 0) text += "None";
    text += "\n";
    const urlEncodedParkName = park.title.replaceAll(" ", "+");
    const url =
      "https://www.google.com/maps/search/?api=1&query=" + urlEncodedParkName;
    text += url + "\n\n";
    doc.text(text, 10, y + 10);
    if (y > PAGE_HEIGHT) {
      doc.addPage();
      y = 10;
    } else {
      y += 70;
    }
  });
  doc.save("NTRL Parks.pdf");
  // const blob = new Blob([JSON.stringify(shownParks.value)], {
  //   type: "text/json;charset=utf-8",
  // });
  // saveAs(blob, "data.json"); //saves park data as JSON
};
const shownParks = ref<Park[]>([]);
// onBeforeMount is a method hook provided by Vue.js to run before this component is mounted (i.e, displayed to the User) to the page.
// in this context the hook is used to fetch data of the parks from the web server. It can take time for an HTTP request to return,
// so we send the request asynchronously (in a separate PC thread) such that the web page does not halt while waiting for the response from
// the server.
onBeforeMount(async () => {
  const response = await axios.get("https://ntrl-fbla.herokuapp.com/");
  allParks.value = response.data as Park[];
  shownParks.value = allParks.value;
  allParks.value.forEach((park: Park) => {
    // create a list of all activities, utilities, and transportation methods from each park.
    // the Set() class removes any duplicates from an array, which we then convert back into an array.
    // Running time analysis:
    // ~50 parks, each park has 3-4 attributes of each quality.
    // This is a running time of O(n) because each operation takes a fixed amount amount of array accesses,
    // meaning that as the amount of parks increases, the amount of time used to filter each park increases by a constant value
    allActivities.value = Array.from(
      new Set(allActivities.value.concat(park.activities))
    );
    allUtilities.value = Array.from(
      new Set(allUtilities.value.concat(park.utilities))
    );
    allTransportations.value = Array.from(
      new Set(allTransportations.value.concat(park.transportation))
    );
  });
});

const openGoogleMapsPark = async (park: Park) => {
  // first mark the park as "visited"
  const resp = await axios.put(
    "https://ntrl-fbla.herokuapp.com/visit/" + park.id
  );
  // reference: https://developers.google.com/maps/documentation/urls/get-started
  const urlEncodedParkName = park.title.replaceAll(" ", "+");
  const url =
    "https://www.google.com/maps/search/?api=1&query=" + urlEncodedParkName;
  window.open(url);
};
</script>

<template>
  <!--
    This part of the App.vue file uses JSX, a combination of HTML and Javascript to define the visual layout of the webpage.
    CSS utility classes are provided by https://tailwindcss.com
  -->
  <div
    class="bg-green-200 w-screen h-screen p-2 flex flex-col flex-shrink-0 font-black overflow-x-hidden"
  >
    <p class="text-3xl p-4 flex justify-center items-center space-x-2">
      <span>Find parks in your area!</span>
      <a
        href="https://github.com/lmaosoggypancakes/ntrl/tree/app"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 hover:fill-blue-700 hover:cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </p>

    <div
      class="border-4 rounded-md border-slate-800 bg-white grid grid-cols-2 gap-2 h-full w-full overflow-x-hidden"
    >
      <div class="my-4 border-r-2 border-r-slate-900 grid grid-rows-12 min-h-0">
        <div class="mx-2 pb-8 border-b-2 border-slate-200 row-span-1">
          <SearchMenu
            @searchChange="changeData"
            :activities="allActivities"
            :utilities="allUtilities"
            :transportation="allTransportations"
          />
        </div>
        <div class="w-full flex justify-center mt-2">
          <button
            class="flex justify-center items-center w-1/2 border-2 border-black rounded-lg hover:bg-gray-700 hover:text-white active:text-green-600 active:bg-white transition-colors"
            type="button"
            @click="saveData"
            v-if="shownParks.length != 0"
          >
            <span>Save Data</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto row-span-11">
          <ul class="px-4" v-if="shownParks.length != 0">
            <li
              v-for="park in shownParks"
              class="border-2 border-black bg-orange-300 rounded-md w-full p-2 mt-2 hover:bg-orange-400"
              @mouseover="hoveredParkId = park.id"
              @click="openGoogleMapsPark(park)"
            >
              <p class="text-2xl underline">{{ park.title }}</p>
              <div class="flex flex-row justify-between">
                <div class="flex-col flex">
                  <ul class="text-xs">
                    <span class="text-xl">Activities:</span>
                    <li v-for="a in park.activities">
                      {{ a }}
                    </li>
                  </ul>
                </div>

                <div class="flex flex-row justify-between">
                  <div class="flex-col flex">
                    <ul class="text-xs">
                      <span class="text-xl">Utilities:</span>
                      <li v-for="a in park.utilities">
                        {{ a }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="flex flex-row justify-between">
                  <div class="flex-col flex">
                    <ul class="text-xs">
                      <span class="text-xl">Transportation:</span>
                      <li v-for="a in park.transportation">
                        {{ a }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-3xl text-center">
            No matching results :(<br />Try another search!
          </div>
        </div>
      </div>
      <div class="overflow-hidden">
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 100%"
        >
          <ol-view
            ref="view"
            :center="mapCenter"
            :rotation="mapRotation"
            :zoom="mapZoom"
            :projection="mapProjection"
          />
          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>
          <ol-overlay
            v-for="park of shownParks"
            :position="[park.y, park.x]"
            :content="park.title"
            v-tippy
          >
            <!-- the v-tippy and content directive are used to declaratively and dynamically provide visual tooltips. -->
            <template v-slot="slotProps">
              <!-- show a green icon if its corresponding park is hovered over, else just the black/white one -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                v-if="park.id == hoveredParkId"
              >
                <path
                  class="fill-green-500"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-67"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                v-else
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </template>
          </ol-overlay>
        </ol-map>
      </div>
    </div>
  </div>
</template>

<style>
/*  CSS rules. Font declarations, and animations. */
@font-face {
  font-family: Cereal;
  src: url("assets/fonts/AirbnbCereal_W_Md.otf");
}
body {
  font-family: "Cereal";
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
