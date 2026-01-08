
import { createRouter, createWebHistory } from 'vue-router'
import EventsPage from '../views/EventsPage.vue'
import BookingsView from '../views/BookingsView.vue'
import SetlistPage from '../views/SetlistPage.vue'
import VideosPage from '../views/VideosPage.vue'
import AdminPage from '../views/AdminPage.vue'
import { useUiStore } from '@/stores/ui.js';

const routes = [
  {
    path: '/',
    redirect: '/events'
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsPage
  },
  {
    path: '/book',
    name: 'BookUs',
    component: BookingsView
  },
  {
    path: '/setlist',
    name: 'Setlist',
    component: SetlistPage
  },
  {
    path: '/videos',
    name: 'Videos',
    component: VideosPage
  },
  // Don't underestimate the sneaki'ness Deeds...
  // Sneaky admin route - not linked anywhere in the UI
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let loadingTimeout = null;
router.beforeEach((to, from, next) => {
  // const ui = useUiStore();
  // ui.showLoading();
  // if (loadingTimeout) clearTimeout(loadingTimeout);
  // loadingTimeout = setTimeout(() => {
  //   ui.hideLoading();
  // }, 2000);
  next();
});

router.afterEach(() => {
  // Ensure spinner stays at least 3s, but hides after if route is ready
  const ui = useUiStore();
  if (loadingTimeout) {
    // setTimeout(() => ui.hideLoading(), 2000);
  } else {
    // ui.hideLoading();
  }
});

export default router
