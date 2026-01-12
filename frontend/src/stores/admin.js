import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // ============ STATE ============
  const isAuthenticated = ref(false)
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ============ ACTIONS ============
  // Get stored password for API calls
  function getPassword() {
    return sessionStorage.getItem('adminPassword')
  }

  // Login with admin password
  async function login(password) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-admin-password': password
        }
      })

      if (!response.ok) {
        throw new Error('Invalid password')
      }

      // Store password in session for subsequent requests
      sessionStorage.setItem('adminPassword', password)
      isAuthenticated.value = true
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  function logout() {
    sessionStorage.removeItem('adminPassword')
    isAuthenticated.value = false
    events.value = []
  }

  // Check if already logged in
  function checkAuth() {
    const password = sessionStorage.getItem('adminPassword')
    if (password) {
      isAuthenticated.value = true
    }
    return isAuthenticated.value
  }

  // Fetch all events
  async function fetchEvents() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-admin-password': getPassword()
        }
      })

      if (!response.ok) throw new Error('Failed to fetch events')

      events.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Create a new event
  async function createEvent(event) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-admin-password': getPassword()
        },
        body: JSON.stringify(event)
      })

      if (!response.ok) throw new Error('Failed to create event')

      const newEvent = await response.json()
      events.value.push(newEvent)
      return newEvent
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update an event
  async function updateEvent(id, event) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-admin-password': getPassword()
        },
        body: JSON.stringify(event)
      })

      if (!response.ok) throw new Error('Failed to update event')

      const updated = await response.json()
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) {
        events.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete an event
  async function deleteEvent(id) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-admin-password': getPassword()
        }
      })

      if (!response.ok) throw new Error('Failed to delete event')

      events.value = events.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ RETURN ============
  return {
    // State
    isAuthenticated,
    events,
    loading,
    error,
    // Actions
    login,
    logout,
    checkAuth,
    getPassword,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }
})
