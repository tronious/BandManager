<template>
  <div class="page">
    <PageHeader
      title="Come see us play live!"
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

<script setup>
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue'
import CommentModal from '@/components/CommentModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useCommentsStore } from '@/stores/comments'
import { useUiStore } from '@/stores/ui'

const commentsStore = useCommentsStore()
const uiStore = useUiStore()

const events = ref([])
const loading = ref(false)
const error = ref(null)
const showCommentModal = ref(false)
const selectedEvent = ref(null)

function getCommentCount(eventId) {
  return commentsStore.getCommentCount(eventId)
}

function openCommentModal(event) {
  selectedEvent.value = event
  showCommentModal.value = true
}

function closeCommentModal() {
  showCommentModal.value = false
}

async function fetchEvents() {
  loading.value = false
  error.value = null
  uiStore.showLoading('Loading events...', 1000)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY
      }
    })
    if (!response.ok) throw new Error('Failed to fetch events')
    events.value = await response.json()

    // Fetch comment counts for all events
    if (events.value.length > 0) {
      const eventIds = events.value.map(e => e.id)
      await commentsStore.fetchCommentCounts(eventIds)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    // Ensure spinner shows for at least 1500ms
    setTimeout(() => {
      uiStore.hideLoading()
    }, 1000)
    loading.value = false
  }
}

onMounted(async () => {
  await fetchEvents()
})
</script>

<style scoped>
.events-grid {
  display: grid;
  gap: 1rem;
}
</style>
