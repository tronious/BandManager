import { defineStore } from 'pinia'
import { ref } from 'vue'

// UI Store to manage global loading state.  Anyone can trigger the loading spinner with a custom message
// by triggering the showLoading action.
export const useUiStore = defineStore('ui', () => {
  // ============ STATE ============
  const loading = ref(false)
  const loadingMessage = ref('')
  const loadingStartTime = ref(null)
  const hideTimeout = ref(null)
  const autoHideTimeout = ref(null)

  // ============ ACTIONS ============
  function showLoading(message = 'Loading...', duration = null) {
    // Clear any pending timeouts
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value)
      hideTimeout.value = null
    }
    if (autoHideTimeout.value) {
      clearTimeout(autoHideTimeout.value)
      autoHideTimeout.value = null
    }

    loadingMessage.value = message
    loading.value = true
    loadingStartTime.value = Date.now()

    // Auto-hide after duration if specified
    if (duration) {
      autoHideTimeout.value = setTimeout(() => {
        loading.value = false
        loadingMessage.value = ''
        loadingStartTime.value = null
        autoHideTimeout.value = null
      }, duration)
    }
  }

  function hideLoading() {
    const minDisplayTime = 3000 // 3 seconds minimum
    const elapsed = Date.now() - (loadingStartTime.value || 0)
    const remaining = minDisplayTime - elapsed

    if (remaining > 0) {
      // Schedule hide after remaining time
      if (!hideTimeout.value) {
        hideTimeout.value = setTimeout(() => {
          loading.value = false
          loadingMessage.value = ''
          loadingStartTime.value = null
          hideTimeout.value = null
        }, remaining)
      }
    } else {
      // Already past minimum time, hide immediately
      loading.value = false
      loadingMessage.value = ''
      loadingStartTime.value = null
    }
  }

  // ============ RETURN ============
  return {
    // State
    loading,
    loadingMessage,
    loadingStartTime,
    hideTimeout,
    autoHideTimeout,
    // Actions
    showLoading,
    hideLoading
  }
})
