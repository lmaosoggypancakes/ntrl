import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import "vue-toastification/dist/index.css";
import router from "./router";
import Toast from "vue-toastification";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import ECharts, { THEME_KEY } from "vue-echarts";
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
  .component("v-chart", ECharts)
  .mount("#app");
