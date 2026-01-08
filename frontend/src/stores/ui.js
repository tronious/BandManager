import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false,
    loadingMessage: '',
    loadingStartTime: null,
    hideTimeout: null
  }),
  actions: {
    showLoading(message = 'Loading...') {
      // Clear any pending hide timeout
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      this.loadingMessage = message;
      this.loading = true;
      this.loadingStartTime = Date.now();
    },
    hideLoading() {
      const minDisplayTime = 3000; // 2 seconds minimum
      const elapsed = Date.now() - (this.loadingStartTime || 0);
      const remaining = minDisplayTime - elapsed;

      if (remaining > 0) {
        // Schedule hide after remaining time
        if (!this.hideTimeout) {
          this.hideTimeout = setTimeout(() => {
            this.loading = false;
            this.loadingMessage = '';
            this.loadingStartTime = null;
            this.hideTimeout = null;
          }, remaining);
        }
      } else {
        // Already past minimum time, hide immediately
        this.loading = false;
        this.loadingMessage = '';
        this.loadingStartTime = null;
      }
    }
  }
})
