<template>
  <div class="page">
    <div class="page-header">
      <h2>Upcoming Events</h2>
      <p>Your gigs and setlists, all in one place</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="fetchEvents">Try Again</button>
    </div>

    <div v-else-if="events.length === 0" class="empty-state">
      <span class="empty-icon">🎤</span>
      <h3>No events yet</h3>
      <p>Time to book some gigs!</p>
    </div>

    <div v-else class="events-grid">
      <article v-for="(e, index) in events" :key="e.id" class="event-card" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="event-date">
          <span class="date-day">{{ formatDay(e.date) }}</span>
          <span class="date-month">{{ formatMonth(e.date) }}</span>
        </div>
        <div class="event-details">
          <h3 class="event-name">{{ e.name }}</h3>
          <p class="event-info">{{ formatFullDate(e.date) }}</p>
        </div>
        <RouterLink :to="`/events/${e.id}/setlist`" class="event-action">
          <span>Open Setlist</span>
          <span class="arrow">→</span>
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventsPage',
  data() {
    return {
      events: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.fetchEvents()
  },
  methods: {
    async fetchEvents() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`)
        if (!response.ok) throw new Error('Failed to fetch events')
        this.events = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    formatDay(dateStr) {
      return new Date(dateStr).getDate()
    },
    formatMonth(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })
    },
    formatFullDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }
}
</script>

<style scoped>
.events-grid {
  display: grid;
  gap: 1rem;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  transition: var(--transition);
  animation: slideIn 0.4s ease backwards;
}

.event-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateX(4px);
  box-shadow: var(--shadow-glow);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 60px;
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  padding: 0.5rem;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: white;
}

.date-month {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.event-info {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.event-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--accent-primary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: var(--transition);
  white-space: nowrap;
}

.event-action:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.event-action .arrow {
  transition: transform 0.2s ease;
}

.event-action:hover .arrow {
  transform: translateX(3px);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1rem;
}

.error-icon {
  font-size: 2.5rem;
}

.error-state p {
  color: #f87171;
}

@media (max-width: 640px) {
  .event-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .event-action {
    width: 100%;
    justify-content: center;
  }
}
</style>
