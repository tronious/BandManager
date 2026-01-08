<!-- AdminLogin.vue -->
<!-- Sneaky login modal for admin access -->
<template>
  <BaseModal :show="show" size="small" @close="$emit('close')">
    <div class="admin-login">
      <h2 class="login-title">
        <span class="icon">🔐</span>
        Backstage Access
      </h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter the secret password"
            autocomplete="off"
            required
          />
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Checking...' : 'Enter' }}
        </button>
      </form>
      
      <p class="hint">🤫 Shh... this is our little secret</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import { useAdminStore } from '@/stores/admin'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const router = useRouter()
const adminStore = useAdminStore()

const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  const success = await adminStore.login(password.value)
  
  if (success) {
    password.value = ''
    emit('success')
    emit('close')
    router.push('/admin')
  } else {
    error.value = 'Wrong password, nice try! 😏'
  }
  
  loading.value = false
}
</script>

<style scoped>
.admin-login {
  color: var(--text-primary);
  text-align: center;
}

.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 1.5rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group input {
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

.form-group input:focus {
  outline: none;
  border-color: var(--text-primary);
}

.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.login-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-style: italic;
}
</style>
