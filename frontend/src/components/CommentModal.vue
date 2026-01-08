<!-- CommentModal.vue -->
<!-- Modal for viewing and leaving comments on an event -->
<template>
  <BaseModal :show="show" size="medium" @close="$emit('close')">
    <div class="comment-modal">
      <h2 class="modal-title">
        <span class="icon">💬</span>
        Comments for {{ eventName }}
      </h2>

      <!-- Comment Form -->
      <form @submit.prevent="submitComment" class="comment-form">
        <div class="form-group">
          <label for="authorName">Your Name</label>
          <input
            id="authorName"
            v-model="authorName"
            type="text"
            placeholder="Enter your name"
            maxlength="100"
            required
          />
        </div>
        <div class="form-group">
          <label for="message">Your Comment</label>
          <textarea
            id="message"
            v-model="message"
            placeholder="Tell us about your experience at the show!"
            maxlength="1000"
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
        </button>
        <p v-if="submitError" class="error-message">{{ submitError }}</p>
        <p v-if="submitSuccess" class="success-message">Thanks for your comment!</p>
      </form>

      <!-- Comments List -->
      <div class="comments-list">
        <h3 class="comments-heading">Previous Comments</h3>
        
        <div v-if="isLoading" class="loading">Loading comments...</div>
        
        <div v-else-if="comments.length === 0" class="no-comments">
          No comments yet. Be the first to share your experience!
        </div>
        
        <div v-else class="comments-scroll">
          <article v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author_name }}</span>
              <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
            </div>
            <p class="comment-message">{{ comment.message }}</p>
          </article>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useCommentsStore } from '@/stores/comments'
import { useUiStore } from '@/stores/ui'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  eventId: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    default: 'this event'
  }
})

const emit = defineEmits(['close'])

const commentsStore = useCommentsStore()
const uiStore = useUiStore()

// Form state
const authorName = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

// Computed properties from store
const comments = computed(() => commentsStore.getComments(props.eventId))
const isLoading = computed(() => commentsStore.isLoading(props.eventId))

// Fetch comments when modal opens
watch(() => props.show, async (newVal) => {
  if (newVal && props.eventId) {
    uiStore.showLoading('Loading comments...')
    try {
      await commentsStore.fetchComments(props.eventId)
    } finally {
      uiStore.hideLoading()
    }
  }
})

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Submit a new comment
async function submitComment() {
  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false
  uiStore.showLoading('Posting your comment...')
  
  try {
    await commentsStore.postComment(props.eventId, authorName.value, message.value)
    // Clear form on success
    authorName.value = ''
    message.value = ''
    submitSuccess.value = true
    // Hide success message after 3 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 3000)
  } catch (err) {
    submitError.value = err.message
  } finally {
    uiStore.hideLoading()
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.comment-modal {
  color: var(--text-primary);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-right: 2rem;
}

.icon {
  font-size: 1.5rem;
}

/* Form Styles */
.comment-form {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
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
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--text-primary);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.75rem;
  color: #ff6b6b;
  font-size: 0.875rem;
}

.success-message {
  margin-top: 0.75rem;
  color: #51cf66;
  font-size: 0.875rem;
}

/* Comments List Styles */
.comments-heading {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.comments-scroll {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading,
.no-comments {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
}

.comment {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
}

.comment-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-message {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
</style>
