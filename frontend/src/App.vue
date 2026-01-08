<template>
  <div>
    <div class="app">
      <!-- Floating music notes background -->
      <!-- Each note is absolutely positioned and animated
        hacky?  Maybe...cool?  Absolutely  -->
      <div class="notes-bg" aria-hidden="true">
        <span class="note note-1">♪</span>
        <span class="note note-2">♫</span>
        <span class="note note-3">♪</span>
        <span class="note note-4">♫</span>
        <span class="note note-5">♪</span>
        <span class="note note-6">♫</span>
        <span class="note note-7">♪</span>
        <span class="note note-8">♫</span>
        <span class="note note-9">♪</span>
        <span class="note note-10">♫</span>
        <span class="note note-11">♪</span>
        <span class="note note-12">♫</span>
        <span class="note note-13">♪</span>
        <span class="note note-14">♫</span>
      </div>

      <header class="topbar">
        <div class="logo">
          <h1><span class="logo-text">Tronious</span> <span class="logo-accent">Music</span></h1>
        </div>
        <nav class="nav">
          <RouterLink to="/events" class="nav-link">
            Upcoming Shows
          </RouterLink>
          <RouterLink to="/book" class="nav-link">
            Book Us!
          </RouterLink>
          <RouterLink to="/videos" class="nav-link">
            Videos
          </RouterLink>
        </nav>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
    <!-- Welcome splash screen on initial load -->
    <Transition name="fade">
      <div v-if="showWelcome" class="welcome-splash">
        <div class="welcome-spinner">
          <div class="record-grooves"></div>
          <img src="@/assets/tronious.jpg" alt="Tronious Label" class="record-label" />
          <div class="spindle-hole"></div>
        </div>
        <p class="welcome-text">Welcome to <span class="accent">Tronious Music</span></p>
        <p class="welcome-subtext">Let the music move you...</p>
      </div>
    </Transition>
    <!-- Global loading spinner overlay -->
    <LoadingSpinner v-if="ui.loading && !showWelcome" class="global-spinner" message="Getting the latest events..." />
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.js';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// UI store for global loading state
const ui = useUiStore();

// Welcome splash screen state
const showWelcome = ref(true);

// Router hooks to show/hide loading spinner on route changes
const router = useRouter();
let loadingTimeout = null;

// Show loading spinner with minimum display time..just gives a nice effect
function startLoading() {
  ui.showLoading();
  if (loadingTimeout) clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    ui.hideLoading();
  }, 2000);
}
function stopLoading() {
  if (loadingTimeout) {
    // setTimeout(() => ui.hideLoading(), 2000);
  } else {
    // ui.hideLoading();
  }
}

// Setup the router hooks on mount
onMounted(() => {
  // Hide welcome splash after 5 seconds
  setTimeout(() => {
    showWelcome.value = false;
  }, 1500);

  router.beforeEach((to, from, next) => {
    // Only show spinner for EventsView
    if (to.name === 'Events' || to.path === '/events') {
      startLoading();
    } else {
      ui.hideLoading();
    }
    next();
  });
  router.afterEach(() => {
    stopLoading();
  });
});
</script>
<style scoped>
/* Welcome splash screen */
.welcome-splash {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #1a1a1f 0%, #0a0a0b 100%);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.welcome-spinner {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle at 60% 40%, #222 60%, #111 100%);
  position: relative;
  animation: spin 2s linear infinite;
  box-shadow: 
    0 0 60px rgba(248, 113, 113, 0.3),
    0 0 120px rgba(248, 113, 113, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-spinner .record-grooves {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  pointer-events: none;
  background:
    repeating-radial-gradient(circle, transparent 0 12px, rgba(255,255,255,0.04) 13px 14px),
    repeating-radial-gradient(circle, transparent 0 28px, rgba(255,255,255,0.03) 29px 30px);
}

.welcome-spinner .record-label {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: contain;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.welcome-spinner .spindle-hole {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0a0a0b;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.welcome-text .accent {
  color: #f87171;
  font-style: italic;
}

.welcome-subtext {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Overlay spinner styles */
.global-spinner {
  position: fixed;
  inset: 0;
  margin: 0;
  background: radial-gradient(ellipse at center, #1a1a1f 0%, #0a0a0b 100%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  pointer-events: all;
}

.global-spinner :deep(.record-spinner) {
  width: 300px;
  height: 300px;
  box-shadow: 
    0 0 60px rgba(248, 113, 113, 0.3),
    0 0 120px rgba(248, 113, 113, 0.1);
}

.global-spinner :deep(.record-label) {
  width: 120px;
  height: 120px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.global-spinner :deep(.record-grooves) {
  background:
    repeating-radial-gradient(circle, transparent 0 12px, rgba(255,255,255,0.04) 13px 14px),
    repeating-radial-gradient(circle, transparent 0 28px, rgba(255,255,255,0.03) 29px 30px);
}

.global-spinner :deep(.loading-state p) {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  /* background: linear-gradient(to bottom, #1a1a1f 0%, #121215 100%); */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 
    0 1px 0 rgba(228, 42, 42, 0.75) inset,
    0 8px 32px rgba(0, 0, 0, 0.9),
    0 2px 8px rgba(0, 0, 0, 0.9);
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.logo-text {
  background: linear-gradient(135deg, #fff 0%, #ccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-accent {
  color: #f87171;
  font-weight: 400;
  font-style: italic;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover {
  background: var(--bg-card);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.nav-icon {
  font-size: 1rem;
}

.content {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

/* Floating music notes */
.notes-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.note {
  position: absolute;
  font-size: 2.2rem;
  color: rgba(255, 255, 255, 0.9);
  animation: float 20s ease-in-out infinite;
}

.note-1 { left: 5%; top: 20%; animation-delay: 0s; animation-duration: 13s; color: rgba(250, 204, 21, 0.8); }
.note-2 { left: 15%; top: 60%; animation-delay: -2.5s; animation-duration: 11s; font-size: 3rem; color: rgba(248, 113, 113, 0.8); }
.note-3 { left: 30%; top: 40%; animation-delay: -5s; animation-duration: 14s; color: rgba(250, 204, 21, 0.8); }
.note-4 { left: 50%; top: 80%; animation-delay: -1.5s; animation-duration: 12s; font-size: 2.7rem; color: rgba(248, 113, 113, 0.8); }
.note-5 { left: 65%; top: 25%; animation-delay: -4s; animation-duration: 13s; color: rgba(250, 204, 21, 0.8); }
.note-6 { left: 80%; top: 55%; animation-delay: -6s; animation-duration: 11.5s; font-size: 3.5rem; color: rgba(248, 113, 113, 0.8); }
.note-7 { left: 90%; top: 35%; animation-delay: -7.5s; animation-duration: 13.5s; }
.note-8 { left: 40%; top: 15%; animation-delay: -3.5s; animation-duration: 10.5s; font-size: 2.6rem; color: rgba(250, 204, 21, 0.8); }
.note-9 { left: 10%; top: 85%; animation-delay: -1s; animation-duration: 15s; font-size: 2.8rem; color: rgba(248, 113, 113, 0.8); }
.note-10 { left: 75%; top: 70%; animation-delay: -9s; animation-duration: 12s; color: rgba(250, 204, 21, 0.8); }
.note-11 { left: 55%; top: 45%; animation-delay: -5.5s; animation-duration: 13s; font-size: 3rem; color: rgba(248, 113, 113, 0.8); }
.note-12 { left: 25%; top: 75%; animation-delay: -3s; animation-duration: 11.5s; color: rgba(250, 204, 21, 0.8); }
.note-13 { left: 85%; top: 15%; animation-delay: -7s; animation-duration: 13.5s; font-size: 3rem; }
.note-14 { left: 45%; top: 55%; animation-delay: -4.5s; animation-duration: 12.5s; font-size: 2.3rem; color: rgba(248, 113, 113, 0.8); }

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.25;
  }
  25% {
    transform: translate(30px, -40px) rotate(15deg);
    opacity: 0.35;
  }
  50% {
    transform: translate(-20px, -80px) rotate(-10deg);
    opacity: 0.15;
  }
  75% {
    transform: translate(40px, -40px) rotate(20deg);
    opacity: 0.3;
  }
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
