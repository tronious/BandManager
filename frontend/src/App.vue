<template>
  <div class="app">
    <header class="topbar">
      <div class="logo">
        <span class="logo-icon">🎸</span>
        <h1>BandManager</h1>
      </div>
      <nav class="nav">
        <RouterLink to="/events" class="nav-link">
          <span class="nav-icon">📅</span>
          Events
        </RouterLink>
        <RouterLink to="/library" class="nav-link">
          <span class="nav-icon">📚</span>
          Library
        </RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>© 2026 BandManager — Rock on! 🤘</p>
    </footer>
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
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
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
  background: var(--accent-gradient);
  color: white;
}

.nav-icon {
  font-size: 1rem;
}

.content {
  flex: 1;
}

.footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.footer p {
  font-size: 0.875rem;
  color: var(--text-muted);
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
