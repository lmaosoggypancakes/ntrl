<template>
  <div class="w-full h-full p-8">
    <span
      class="text-center flex justify-center items-center text-3xl h-[6.25%]"
      >Edit {{ name }}
    </span>
    <div class="border-green-100 border-2 h-[93.75%] w-full rounded-xl">
      <form
        @submit.prevent="addPark(event)"
        class="flex flex-col w-full h-full p-8 space-y-8"
      >
        <button
          type="submit"
          disabled
          style="display: none"
          aria-hidden="true"
        ></button>
        <div class="flex flex-row w-full items-center">
          <div class="w-5/6">
            <label class="label">
              <span class="label-text">Park Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Yellowstone National Park"
              class="input input-bordered w-full"
              v-model="name"
            />
          </div>
          <div class="flex flex-row items-center justify-between w-1/6">
            <div class="flex flex-col justify-center items-center">
              <label
                class="label cursor-pointer w-full flex items-center justify-center"
              >
                <span class="label-text">Dogs Allowed</span>
              </label>
              <input
                type="checkbox"
                checked="checked"
                class="checkbox checkbox-primary w-8 h-8"
                v-model="doggable"
              />
            </div>
            <div class="flex flex-col justify-center items-center">
              <label
                class="label cursor-pointer w-full flex items-center justify-center"
              >
                <span class="label-text">Save</span>
              </label>
              <button type="submit" class="btn btn-primary">
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex flex-row justify-between">
          <div class="form-control w-1/4">
            <label class="label">
              <span class="label-text">Region</span>
            </label>
            <div class="input-group w-full">
              <select class="select select-bordered w-full" v-model="region">
                <option selected>Northern</option>
                <option>Southern</option>
                <option>Western</option>
              </select>
              <span>Nevada</span>
            </div>
          </div>
          <div class="form-control w-1/4">
            <label class="label">
              <span class="label-text">Longitude</span>
            </label>
            <label class="input-group w-full">
              <input
                type="number"
                step="any"
                placeholder=""
                class="input input-bordered w-full outline-none appearance-none"
                v-model="x"
              />
              <span>°N</span>
            </label>
          </div>
          <div class="form-control w-1/4">
            <label class="label">
              <span class="label-text">Latitude</span>
            </label>
            <label class="input-group w-full">
              <input
                type="number"
                step="any"
                class="input input-bordered w-full outline-none appearance-none"
                v-model="y"
              />
              <span>°W</span>
            </label>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex flex-row justify-between h-full overflow-hidden">
          <div class="p-4 w-full flex flex-col justify-between">
            <label class="label">
              <span class="label-text">Activities</span>
            </label>
            <ul class="menu bg-base-100 rounded-box w-full h-4/6 overflow-auto">
              <li
                class="hover:bg-orange-500 transition-all p-1 w-full flex flex-col"
                v-for="a in activities"
              >
                <div class="w-full flex justify-between">
                  <span class="block">{{ a }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 p-0 float-right"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    @click="removeActivity(a)"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </li>
            </ul>
            <div class="form-control h-1/6 w-full">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Add new activity"
                  class="input input-bordered w-full capitalize"
                  v-model="newActivity"
                  @keyup.enter="addActivity()"
                />
                <button type="button" class="btn btn-square">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="p-4 w-full flex flex-col justify-between">
            <label class="label">
              <span class="label-text">Utilities</span>
            </label>
            <ul class="menu bg-base-100 rounded-box w-full h-4/6 overflow-auto">
              <li
                class="hover:bg-orange-500 transition-all p-1 w-full flex flex-col"
                v-for="u in utilities"
              >
                <div class="w-full flex justify-between">
                  <span class="block">{{ u }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 p-0 float-right"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    @click="removeUtility(a)"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </li>
            </ul>
            <div class="form-control h-1/6 w-full">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Add new utility"
                  class="input input-bordered w-full capitalize"
                  @keyup.enter="addUtility()"
                  v-model="newUtility"
                />
                <button type="button" class="btn btn-square">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="p-4 w-full flex flex-col justify-between">
            <label class="label">
              <span class="label-text">Transportation</span>
            </label>
            <ul class="menu bg-base-100 rounded-box w-full h-4/6 overflow-auto">
              <li
                class="hover:bg-orange-500 transition-all p-1 w-full flex flex-col"
                v-for="t in transportation"
              >
                <div class="w-full flex justify-between">
                  <span class="block">{{ t }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 p-0 float-right"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    @click="removeTransportation(a)"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </li>
            </ul>
            <div class="form-control h-1/6 w-full">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Add new transportation"
                  class="input input-bordered w-full capitalize"
                  @keyup.enter="addTransportation()"
                  v-model="newTransportation"
                />
                <button type="button" class="btn btn-square">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { useToast, POSITION } from "vue-toastification";
import { editPark, getPark } from "../../api";
const route = useRoute();
const toast = useToast();
const name = ref();
const doggable = ref(false);
const region = ref("Northern");
const x = ref(0);
const y = ref(0);
const newTransportation = ref("");
const newUtility = ref("");
const newActivity = ref("");
const transportation = ref([]);
const activities = ref([]);
const utilities = ref([]);
onBeforeMount(async () => {
  const response = await getPark(route.params.id);
  const data = response.data;
  name.value = data.title;
  region.value = data.region;
  doggable.value = data.dogabble;
  x.value = data.x;
  y.value = data.y;
  activities.value = data.activities;
  transportation.value = data.transportation;
  utilities.value = data.utilities;
});
const addTransportation = () => {
  transportation.value.push(newTransportation.value);
  newTransportation.value = "";
};
const addUtility = () => {
  utilities.value.push(newUtility.value);
  newUtility.value = "";
};
const addActivity = () => {
  activities.value.push(newActivity.value);
  newActivity.value = "";
};

const removeTransportation = (val) => {
  const index = transportation.value.findIndex((t) => t == val);
  if (index == 0) transportation.value = [];
  else if (index) transportation.value.splice(index, 1);
};
const removeUtility = (val) => {
  const index = utilities.value.findIndex((t) => t == val);
  if (index == 0) utilities.value = [];
  else if (index) utilities.value.splice(index, 1);
};
const removeActivity = (val) => {
  const index = activities.value.findIndex((t) => t == val);
  if (index == 0) activities.value = [];
  else if (index) activities.value.splice(index, 1);
};

const addPark = async () => {
  const parkData = {
    title: name.value,
    dogabble: doggable.value,
    activities: activities.value,
    transportation: transportation.value,
    utilities: utilities.value,
    region: region.value,
    x: x.value,
    y: y.value,
  };
  const resp = await editPark(parkData, route.params.id);
  if (resp)
    toast.success("Park successfully saved!", {
      timeout: 3000,
      position: POSITION.TOP_CENTER,
    });
  else
    toast.error("Error while saving park :(", {
      timeout: 3000,
      position: POSITION.TOP_CENTER,
    });
};
</script>
