<template>
  <div class="error-state">
    <span class="error-icon">⚠️</span>
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
  font-size: 2.5rem;
}

.error-message {
  color: #f87171;
  font-size: 1rem;
}

button {
  margin-top: 0.5rem;
}
</style>
