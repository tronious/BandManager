<template>
  <div class="page">
    <div class="page-header">
      <RouterLink to="/events" class="back-link">
        <span>←</span> Back to Events
      </RouterLink>
      <PageHeader
        title="Setlist"
        :subtitle="`Event #${eventId}`"
      />
    </div>

    <EmptyState
      icon="🎵"
      title="Setlist Builder Coming Soon"
      message="Drag and drop songs to create the perfect setlist"
    >
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
    </EmptyState>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'SetlistPage',
  components: {
    PageHeader,
    EmptyState
  },
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
  margin-bottom: 0.5rem;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--accent-primary);
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
