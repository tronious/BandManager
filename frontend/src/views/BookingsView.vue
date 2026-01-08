<!-- BookingsView.vue -->
<!-- Page for booking inquiries - allows visitors to request the band for events -->
<template>
  <div class="page">
    <PageHeader
      title="Book Us!"
      subtitle="Bring Tronious to your next event"
    />

    <div class="booking-content">
      <div class="booking-intro">
        <p>Looking for live music for your wedding, corporate event, private party, or venue? We'd love to hear from you!</p>
      </div>

      <div class="booking-form-container">
        <form @submit.prevent="submitBooking" class="booking-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Your Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="John Smith"
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="(555) 123-4567"
              />
            </div>
            <div class="form-group">
              <label for="eventDate">Event Date *</label>
              <input
                id="eventDate"
                v-model="form.eventDate"
                type="date"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="eventType">Type of Event *</label>
            <select id="eventType" v-model="form.eventType" required>
              <option value="">Select an event type...</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate Event</option>
              <option value="private">Private Party</option>
              <option value="venue">Venue / Bar / Restaurant</option>
              <option value="festival">Festival</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="venue">Venue / Location</label>
            <input
              id="venue"
              v-model="form.venue"
              type="text"
              placeholder="Venue name and city"
            />
          </div>

          <div class="form-group">
            <label for="message">Tell us about your event *</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              placeholder="What's the occasion? How long do you need us? Any special requests?"
              required
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Inquiry' }}
          </button>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="submitSuccess" class="success-message">
            Thanks for reaching out! We'll get back to you soon.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'BookingsView',
  components: {
    PageHeader
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        venue: '',
        message: ''
      },
      isSubmitting: false,
      submitError: '',
      submitSuccess: false
    }
  },
  methods: {
    async submitBooking() {
      this.isSubmitting = true
      this.submitError = ''
      this.submitSuccess = false

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const API_KEY = import.meta.env.VITE_API_KEY

        const response = await fetch(`${API_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify(this.form)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to send inquiry')
        }
        
        // Clear form on success
        this.form = {
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          eventType: '',
          venue: '',
          message: ''
        }
        this.submitSuccess = true
      } catch (err) {
        this.submitError = err.message || 'Something went wrong. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.booking-content {
  max-width: 700px;
  margin: 0 auto;
}

.booking-intro {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.booking-form-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
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
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--text-primary);
}

.form-group select {
  cursor: pointer;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  padding: 1rem 2rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
  text-align: center;
}

.success-message {
  color: #51cf66;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .booking-form-container {
    padding: 1.5rem;
  }
}
</style>
