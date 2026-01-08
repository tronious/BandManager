<!-- AdminPage.vue -->
<!-- Secret admin dashboard for managing events -->
<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>🎛️ Backstage Control Panel</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <!-- Add/Edit Event Form -->
    <div class="event-form-card">
      <h2>{{ editingEvent ? 'Edit Event' : 'Add New Event' }}</h2>
      <form @submit.prevent="saveEvent" class="event-form">
        <div class="form-row">
          <div class="form-group">
            <label for="eventName">Event Name *</label>
            <input
              id="eventName"
              v-model="form.name"
              type="text"
              placeholder="e.g. King Seat Tavern"
              required
            />
          </div>
          <div class="form-group">
            <label for="eventDate">Date *</label>
            <input
              id="eventDate"
              v-model="form.date"
              type="date"
              required
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="eventVenue">Venue</label>
            <input
              id="eventVenue"
              v-model="form.venue"
              type="text"
              placeholder="e.g. Downtown Nashville"
            />
          </div>
          <div class="form-group">
            <label for="eventTicketUrl">Ticket URL</label>
            <input
              id="eventTicketUrl"
              v-model="form.ticket_url"
              type="url"
              placeholder="https://..."
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="eventDescription">Description</label>
          <textarea
            id="eventDescription"
            v-model="form.description"
            placeholder="Tell fans about this event..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="save-btn" :disabled="adminStore.loading">
            {{ adminStore.loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event') }}
          </button>
          <button v-if="editingEvent" type="button" @click="cancelEdit" class="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Events List -->
    <div class="events-section">
      <h2>Manage Events</h2>
      
      <div v-if="adminStore.loading && !adminStore.events.length" class="loading">
        Loading events...
      </div>
      
      <div v-else-if="adminStore.events.length === 0" class="no-events">
        No events yet. Add your first gig above! 🎸
      </div>
      
      <div v-else class="events-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in sortedEvents" :key="event.id" :class="{ 'past-event': isPastEvent(event.date) }">
              <td>{{ event.name }}</td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ event.venue || '-' }}</td>
              <td class="actions">
                <button @click="editEvent(event)" class="edit-btn" title="Edit">✏️</button>
                <button @click="confirmDelete(event)" class="delete-btn" title="Delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteModal" size="small" @close="showDeleteModal = false">
      <div class="delete-confirm">
        <h3>🗑️ Delete Event?</h3>
        <p>Are you sure you want to delete "{{ eventToDelete?.name }}"?</p>
        <p class="warning">This cannot be undone!</p>
        <div class="modal-actions">
          <button @click="deleteEvent" class="confirm-delete-btn">Yes, Delete</button>
          <button @click="showDeleteModal = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

// Form state
const form = ref({
  name: '',
  date: '',
  venue: '',
  description: '',
  ticket_url: ''
})

const editingEvent = ref(null)
const showDeleteModal = ref(false)
const eventToDelete = ref(null)

// Sorted events (upcoming first, then past)
const sortedEvents = computed(() => {
  return [...adminStore.events].sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Check if user is authenticated
onMounted(() => {
  if (!adminStore.checkAuth()) {
    router.push('/events')
    return
  }
  adminStore.fetchEvents()
})

function isPastEvent(date) {
  const [year, month, day] = date.split('-').map(Number)
  const eventDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate < today
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function resetForm() {
  form.value = {
    name: '',
    date: '',
    venue: '',
    description: '',
    ticket_url: ''
  }
  editingEvent.value = null
}

function editEvent(event) {
  editingEvent.value = event
  form.value = {
    name: event.name,
    date: event.date,
    venue: event.venue || '',
    description: event.description || '',
    ticket_url: event.ticket_url || ''
  }
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetForm()
}

async function saveEvent() {
  try {
    if (editingEvent.value) {
      await adminStore.updateEvent(editingEvent.value.id, form.value)
    } else {
      await adminStore.createEvent(form.value)
    }
    resetForm()
  } catch (err) {
    alert('Failed to save event: ' + err.message)
  }
}

function confirmDelete(event) {
  eventToDelete.value = event
  showDeleteModal.value = true
}

async function deleteEvent() {
  try {
    await adminStore.deleteEvent(eventToDelete.value.id)
    showDeleteModal.value = false
    eventToDelete.value = null
  } catch (err) {
    alert('Failed to delete event: ' + err.message)
  }
}

function logout() {
  adminStore.logout()
  router.push('/events')
}
</script>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 1.75rem;
  color: var(--text-primary);
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Form Card */
.event-form-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.event-form-card h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--text-primary);
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
}

.cancel-btn:hover {
  background: var(--bg-secondary);
}

/* Events Section */
.events-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.events-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.loading,
.no-events {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
}

.events-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
}

td {
  color: var(--text-primary);
}

.past-event td {
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}

.edit-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
}

/* Delete Confirmation Modal */
.delete-confirm {
  text-align: center;
  color: var(--text-primary);
}

.delete-confirm h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.delete-confirm .warning {
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-delete-btn {
  padding: 0.75rem 1.5rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
}

.confirm-delete-btn:hover {
  background: #ff5252;
}
</style>
