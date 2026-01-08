import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAuthenticated: false,
    events: [],
    loading: false,
    error: null
  }),
  
  actions: {
    // Login with admin password
    async login(password) {
      this.loading = true
      this.error = null
      
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
        this.isAuthenticated = true
        return true
      } catch (err) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },
    
    // Logout
    logout() {
      sessionStorage.removeItem('adminPassword')
      this.isAuthenticated = false
      this.events = []
    },
    
    // Check if already logged in
    checkAuth() {
      const password = sessionStorage.getItem('adminPassword')
      if (password) {
        this.isAuthenticated = true
      }
      return this.isAuthenticated
    },
    
    // Get stored password for API calls
    getPassword() {
      return sessionStorage.getItem('adminPassword')
    },
    
    // Fetch all events
    async fetchEvents() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-admin-password': this.getPassword()
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch events')
        
        this.events = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    
    // Create a new event
    async createEvent(event) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-admin-password': this.getPassword()
          },
          body: JSON.stringify(event)
        })
        
        if (!response.ok) throw new Error('Failed to create event')
        
        const newEvent = await response.json()
        this.events.push(newEvent)
        return newEvent
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Update an event
    async updateEvent(id, event) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-admin-password': this.getPassword()
          },
          body: JSON.stringify(event)
        })
        
        if (!response.ok) throw new Error('Failed to update event')
        
        const updated = await response.json()
        const index = this.events.findIndex(e => e.id === id)
        if (index !== -1) {
          this.events[index] = updated
        }
        return updated
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Delete an event
    async deleteEvent(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events/${id}`, {
          method: 'DELETE',
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-admin-password': this.getPassword()
          }
        })
        
        if (!response.ok) throw new Error('Failed to delete event')
        
        this.events = this.events.filter(e => e.id !== id)
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
