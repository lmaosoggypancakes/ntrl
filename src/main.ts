import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

createApp(App).use(OpenLayersMap).mount('#app')
