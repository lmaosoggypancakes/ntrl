<template>
  <div class="h-screen w-screen">
    <div
      class="form-control w-screen h-screen flex flex-col justify-center items-center"
    >
      <label class="label">
        <span class="text-lg"> Welcome! Please enter your API key. </span>
      </label>
      <label class="input-group w-1/2">
        <input type="text" class="input input-bordered w-full" v-model="key" />
        <button class="btn btn-square" :disabled="!isValidKey" @click="setKey">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import router from "../router";
const key = ref("");
const isValidKey = computed(() => {
  return key.value.trim().length === 16;
});
const setKey = () => {
  localStorage.setItem("__API_KEY", key.value);
  router.push("/");
};
</script>
