<template>
  <div class="page">
    <PageHeader
      title="Come see us play live!"
      subtitle="Upcoming gigs and shows where you can see us live!"
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
        :comment-count="getCommentCount(event.id)"
        @openComments="openCommentModal(event)"
      />
    </div>

    <!-- Comment Modal -->
    <CommentModal
      :show="showCommentModal"
      :event-id="selectedEvent?.id"
      :event-name="selectedEvent?.name"
      @close="closeCommentModal"
    />
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
import CommentModal from '@/components/CommentModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useCommentsStore } from '@/stores/comments'

export default {
  name: 'EventsPage',
  components: {
    EventCard,
    CommentModal,
    PageHeader,
    LoadingSpinner,
    EmptyState,
    ErrorState
  },
  setup() {
    const commentsStore = useCommentsStore()
    return { commentsStore }
  },
  data() {
    return {
      events: [],
      loading: false,
      error: null,
      showCommentModal: false,
      selectedEvent: null
    }
  },
  async mounted() {
    await this.fetchEvents()
  },
  methods: {
    getCommentCount(eventId) {
      return this.commentsStore.getCommentCount(eventId)
    },
    openCommentModal(event) {
      this.selectedEvent = event
      this.showCommentModal = true
    },
    closeCommentModal() {
      this.showCommentModal = false
    },
    async fetchEvents() {
      this.loading = false
      this.error = null
      try {
        // Run API call and minimum delay in parallel
        const [response] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
            headers: {
              'x-api-key': import.meta.env.VITE_API_KEY
            }
          }),
        //   new Promise(resolve => setTimeout(resolve, 2000))
        ])
        if (!response.ok) throw new Error('Failed to fetch events')
        this.events = await response.json()
        
        // Fetch comment counts for all events
        if (this.events.length > 0) {
          const eventIds = this.events.map(e => e.id)
          await this.commentsStore.fetchCommentCounts(eventIds)
        }
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
