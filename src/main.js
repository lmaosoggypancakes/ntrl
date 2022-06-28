import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { MotionPlugin } from "@vueuse/motion";
import Loading from "vue3-loading-overlay";
import VueTippy from "vue-tippy";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import ECharts, { THEME_KEY } from "vue-echarts";
import "./index.css";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
import "vue-toastification/dist/index.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/material.css";
use([
  LineChart,
  GridComponent,
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
createApp(App)
  .use(router)
  .use(Toast)
  .use(MotionPlugin)
  .use(VueTippy)
  .component("v-chart", ECharts)
  .component("loader", Loading)
  .mount("#app");
