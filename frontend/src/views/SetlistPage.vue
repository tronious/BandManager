<template>
  <div class="page">
    <div class="page-header">
      <RouterLink to="/events" class="back-link">
        <span>←</span> Back to Events
      </RouterLink>
      <h2>Setlist</h2>
      <p>Event #{{ eventId }}</p>
    </div>

    <div class="setlist-container">
      <div class="coming-soon">
        <div class="icon">🎵</div>
        <h3>Setlist Builder Coming Soon</h3>
        <p>Drag and drop songs to create the perfect setlist</p>
        
        <div class="features-preview">
          <div class="feature">
            <span>🎯</span>
            <span>Drag & Drop</span>
          </div>
          <div class="feature">
            <span>📑</span>
            <span>PDF Viewer</span>
          </div>
          <div class="feature">
            <span>🖨️</span>
            <span>Print Ready</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetlistPage',
  props: {
    eventId: { type: String, required: true }
  }
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--accent-primary);
}

.setlist-container {
  margin-top: 2rem;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-lg);
  animation: fadeIn 0.4s ease;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.coming-soon h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.coming-soon > p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.features-preview {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature span:first-child {
  font-size: 1rem;
}
</style>
