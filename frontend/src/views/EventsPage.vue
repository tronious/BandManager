<template>
  <div class="page">
    <PageHeader
      title="Upcoming Events"
      subtitle="Your gigs and setlists, all in one place"
    />

    <LoadingSpinner v-if="loading" message="Loading events..." />

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="fetchEvents"
    />

    <EmptyState
      v-else-if="events.length === 0"
      icon="🎤"
      title="No events yet"
      message="Time to book some gigs!"
    />

    <div v-else class="events-grid">
      <EventCard
        v-for="(event, index) in events"
        :key="event.id"
        :event="event"
        :animation-delay="index * 0.1"
      />
    </div>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'

export default {
  name: 'EventsPage',
  components: {
    EventCard,
    PageHeader,
    LoadingSpinner,
    EmptyState,
    ErrorState
  },
  data() {
    return {
      events: [],
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.fetchEvents()
  },
  methods: {
    async fetchEvents() {
      this.loading = false
      this.error = null
      try {
        // Run API call and minimum delay in parallel
        const [response] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/events`),
          new Promise(resolve => setTimeout(resolve, 3000))
        ])
        if (!response.ok) throw new Error('Failed to fetch events')
        this.events = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.events-grid {
  display: grid;
  gap: 1rem;
}
</style>
