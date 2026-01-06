<template>
  <div>
    <h2>Events</h2>
    <p>Upcoming gigs and setlists live here.</p>

    <ul>
      <li v-for="e in demoEvents" :key="e.id">
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
      demoEvents: [
        { id: '1', name: 'King Seat Tavern', date: '2026-01-10' },
        { id: '2', name: 'Winery Night', date: '2026-01-17' },
      ],
    }
  },
}
</script>
