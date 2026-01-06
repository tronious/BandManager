import { createRouter, createWebHistory } from 'vue-router'
import EventsPage from '../views/EventsPage.vue'
import LibraryPage from '../views/LibraryPage.vue'
import SetlistPage from '../views/SetlistPage.vue'

const routes = [
  {
    path: '/',
    name: 'Events',
    component: EventsPage
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryPage
  },
  {
    path: '/setlist',
    name: 'Setlist',
    component: SetlistPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
