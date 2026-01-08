<!-- EventCard.vue -
this component displays an individual event card with date, name, and a link to the setlist

todo: hook this into live data  -->
<template>
  <article class="event-card" :style="{ animationDelay: `${animationDelay}s` }">
    <div class="event-date">
      <span class="date-day">{{ day }}</span>
      <span class="date-month">{{ month }}</span>
    </div>
    <div class="event-details">
      <h3 class="event-name">{{ event.name }}</h3>
      <p class="event-info">{{ fullDate }}</p>
    </div>
    <button class="event-action" @click="$emit('openComments')">
      <span>💬</span>
      <span>Leave a Comment</span>
      <span v-if="commentCount > 0" class="comment-count">{{ commentCount }}</span>
    </button>
    <!-- Hidden for now until setlist feature is ready
    <RouterLink :to="`/events/${event.id}/setlist`" class="event-action">
      <span>Open Setlist</span>
      <span class="arrow">→</span>
    </RouterLink>
    -->
  </article>
</template>

<script>
export default {
  name: 'EventCard',
  emits: ['openComments'],
  props: {
    event: {
      type: Object,
      required: true
    },
    animationDelay: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // Parse date as local time to avoid timezone shifts
    localDate() {
      const [year, month, day] = this.event.date.split('-').map(Number)
      return new Date(year, month - 1, day)
    },
    day() {
      return this.localDate.getDate()
    },
    month() {
      return this.localDate.toLocaleDateString('en-US', { month: 'short' })
    },
    fullDate() {
      return this.localDate.toLocaleDateString('en-US', {
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
  border-color: rgba(255, 255, 255, 0.15);
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
  background: var(--text-primary);
  border-radius: var(--radius-md);
  padding: 0.5rem;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--bg-primary);
}

.date-month {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--bg-secondary);
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
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg-primary);
}

.event-action:hover .comment-count {
  background: #ff6b6b;
  color: #fff;
}

.comment-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: #ff6b6b;
  color: #fff;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
}

.event-action .arrow {
  transition: transform 0.2s ease;
}

.event-action:hover .arrow {
  transform: translateX(3px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .event-card {
    gap: 1rem;
    padding: 1rem 1.25rem;
  }

  .event-date {
    min-width: 50px;
    height: 50px;
  }

  .date-day {
    font-size: 1.25rem;
  }

  .event-name {
    font-size: 1rem;
  }

  .event-info {
    font-size: 0.8rem;
  }

  .event-action {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .event-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 0.75rem;
  }

  .event-date {
    min-width: 50px;
    height: 50px;
  }

  .event-action {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0.8rem;
  }
}
</style>
