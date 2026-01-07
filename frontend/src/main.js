import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// This is where we create and mount the Vue application with Pinia store and Vue Router
// is this the best place for it?  Maybe not, but it works for now.
createApp(App)
	.use(pinia)
	.use(router)
	.mount('#app')
