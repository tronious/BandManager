<template>
  <div class="error-state">
    <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    <p class="error-message">{{ message }}</p>
    <button v-if="retryable" @click="$emit('retry')">
      Try Again
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    message: {
      type: String,
      default: 'Something went wrong'
    },
    retryable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
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
  width: 3rem;
  height: 3rem;
  color: #f87171;
}

.error-message {
  color: #f87171;
  font-size: 1rem;
}

button {
  margin-top: 0.5rem;
}
</style>
