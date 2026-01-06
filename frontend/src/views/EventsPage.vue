<template>
  <div>
    <h2>Events</h2>
    <p>Upcoming gigs and setlists live here.</p>

    <p v-if="loading">Loading events...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ul v-else>
      <li v-for="e in events" :key="e.id">
        <strong>{{ e.name }}</strong> — {{ e.date }}
        · <RouterLink :to="`/events/${e.id}/setlist`">Open setlist</RouterLink>
      </li>
    </ul>
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      if (!response.ok) throw new Error('Failed to fetch events')
      this.events = await response.json()
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  }
}
</script>
