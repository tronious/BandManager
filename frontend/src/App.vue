<template>
  <div class="app">
    <header class="topbar">
      <h1>BandManager</h1>
      <nav class="nav">
        <RouterLink to="/events">Events</RouterLink>
        <RouterLink to="/library">Library</RouterLink>
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
.app { font-family: system-ui, sans-serif; padding: 16px; }
.topbar { display: flex; align-items: baseline; gap: 24px; }
.nav { display: flex; gap: 12px; }
.nav a { text-decoration: none; }
.nav a.router-link-active { font-weight: 700; }
.content { margin-top: 16px; }
</style>
