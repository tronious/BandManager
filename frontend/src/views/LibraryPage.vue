<template>
  <div class="page">
    <div class="page-header">
      <h2>Song Library</h2>
      <p>Your collection of songs and sheet music</p>
    </div>

    <div class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>Coming Soon</h3>
      <p>Upload and manage your song PDFs here</p>
      <div class="features-preview">
        <div class="feature">
          <span>📄</span>
          <span>PDF Upload</span>
        </div>
        <div class="feature">
          <span>🔍</span>
          <span>Search Songs</span>
        </div>
        <div class="feature">
          <span>🏷️</span>
          <span>Organize by Tags</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'LibraryPage' }
</script>

<style scoped>
.empty-state {
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

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state > p {
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
