/// <reference types="vite/client" />
// this file declares .vue files as TypeScript modules that can be imported and compiled into (native) JavaScript
// that is then run in the browser.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-openlayers';