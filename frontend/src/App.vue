<template>
  <div class="app">
    <header class="topbar">
      <div class="logo">
        <h1>BandManager</h1>
      </div>
      <nav class="nav">
        <RouterLink to="/events" class="nav-link">
          Events
        </RouterLink>
        <RouterLink to="/library" class="nav-link">
          Library
        </RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background: linear-gradient(to bottom, #1a1a1f 0%, #121215 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 2px 8px rgba(0, 0, 0, 0.4);
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
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
  flex: 1;
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
