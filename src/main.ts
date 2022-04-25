import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import 'tippy.js/dist/tippy.css' 
import VueTippy from "vue-tippy";

// Import the app, implement the proper plugins, and mount it to the index.html file.
createApp(App)
    .use(OpenLayersMap)
    .use(VueTippy)
    .mount('#app')