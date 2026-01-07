<template>
  <div class="page">
    <PageHeader
      title="Song Library"
      subtitle="Your collection of songs and sheet music"
    />

    <EmptyState
      icon="📚"
      title="Coming Soon"
      message="Upload and manage your song PDFs here"
    >
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
    </EmptyState>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'LibraryPage',
  components: {
    PageHeader,
    EmptyState
  }
}
</script>

<style scoped>
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
