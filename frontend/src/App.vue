<template>
  <div>
    <div class="app">
      <!-- Floating music notes background with physics-based bouncing -->
      <BouncingNotes />

      <header class="topbar">
        <div class="logo-group">
          <div class="logo">
            <h1><span class="logo-text">Tronious</span> <span class="logo-accent">Music</span></h1>
          </div>
          <TipButton @click="showTipModal = true" />
        </div>
        <nav class="nav">
          <RouterLink to="/events" class="nav-link">
            Gigs
          </RouterLink>          <RouterLink to="/videos" class="nav-link">
            Videos
          </RouterLink>
          <RouterLink to="/book" class="nav-link">
            Book Us!
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
    <!-- Global loading spinner overlay...this is controlled by the UI store in stores/ui.js -->
    <LoadingSpinner v-if="ui.loading && !showWelcome" class="global-spinner" :message="ui.loadingMessage" />
    
    <!-- Sneaky admin login modal -->
    <AdminLogin :show="showAdminLogin" @close="showAdminLogin = false" />
    
    <!-- Tip modal -->
    <TipModal :show="showTipModal" @close="showTipModal = false" />
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.js';
import { useAdminStore } from '@/stores/admin.js';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AdminLogin from '@/components/AdminLogin.vue';
import TipJar from '@/components/TipJar.vue';
import TipButton from '@/components/TipButton.vue';
import TipModal from '@/components/TipModal.vue';
import BouncingNotes from '@/components/BouncingNotes.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// UI store for global loading state
const ui = useUiStore();
const adminStore = useAdminStore();

// Welcome splash screen state
const showWelcome = ref(true);

// Admin login modal state
const showAdminLogin = ref(false);

// Tip modal state
const showTipModal = ref(false);

// Secret keyboard sequence tracker (Ctrl + A, D, M)
let secretSequence = [];
let sequenceTimeout = null;
const SECRET_CODE = ['a', 'd', 'm'];

function handleSecretShortcut(e) {
  // Only track when Ctrl is held
  if (!e.ctrlKey) {
    secretSequence = [];
    return;
  }
  
  const key = e.key.toLowerCase();
  
  // Check if this key is part of our sequence
  if (SECRET_CODE.includes(key)) {
    e.preventDefault();
    secretSequence.push(key);
    
    // Reset sequence after 2 seconds of no input
    if (sequenceTimeout) clearTimeout(sequenceTimeout);
    sequenceTimeout = setTimeout(() => {
      secretSequence = [];
    }, 2000);
    
    // Check if sequence matches
    if (secretSequence.join('') === SECRET_CODE.join('')) {
      secretSequence = [];
      // If already logged in, go straight to admin
      if (adminStore.checkAuth()) {
        router.push('/admin');
      } else {
        showAdminLogin.value = true;
      }
    }
  }
}

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

  // Listen for secret keyboard shortcut
  window.addEventListener('keydown', handleSecretShortcut);

  router.beforeEach((to, from, next) => {
    // Only show spinner for EventsView
    // if (to.name === 'Events' || to.path === '/events') {
    //   startLoading();
    // } else {
    //   ui.hideLoading();
    // }
    next();
  });
  router.afterEach(() => {
    stopLoading();
  });
});

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleSecretShortcut);
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
  background: radial-gradient(ellipse at center, rgba(26, 26, 31, 0.7) 0%, rgba(10, 10, 11, 0.75) 100%);
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

.logo-group {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  font-size:1.3rem;
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
