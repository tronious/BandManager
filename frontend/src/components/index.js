import { createRouter, createWebHistory } from 'vue-router'

import EventsPage from '../views/EventsPage.vue'
import LibraryPage from '../views/LibraryPage.vue'
import SetlistPage from '../views/SetlistPage.vue'

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', component: EventsPage },
  { path: '/library', component: LibraryPage },
  { path: '/events/:eventId/setlist', component: SetlistPage, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})