// stores/comments.js
// Pinia store for managing event comments
// Handles fetching and posting comments through our backend API

import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    // Comments keyed by event ID for caching
    commentsByEvent: {},
    // Comment counts keyed by event ID
    commentCounts: {},
    // Loading state per event
    loading: {},
    // Error state
    error: null
  }),

  getters: {
    // Get comments for a specific event
    getComments: (state) => (eventId) => {
      return state.commentsByEvent[eventId] || []
    },
    
    // Get comment count for a specific event
    getCommentCount: (state) => (eventId) => {
      return state.commentCounts[eventId] || 0
    },
    
    // Check if comments are loading for an event
    isLoading: (state) => (eventId) => {
      return state.loading[eventId] || false
    }
  },

  actions: {
    // Fetch comment counts for multiple events
    async fetchCommentCounts(eventIds) {
      try {
        const response = await fetch(`${API_URL}/api/comments/counts?eventIds=${eventIds.join(',')}`, {
          headers: {
            'x-api-key': API_KEY
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch comment counts')
        }
        
        const counts = await response.json()
        this.commentCounts = { ...this.commentCounts, ...counts }
      } catch (err) {
        console.error('Error fetching comment counts:', err)
      }
    },

    // Fetch comments for a specific event
    async fetchComments(eventId) {
      this.loading[eventId] = true
      this.error = null
      
      try {
        const response = await fetch(`${API_URL}/api/comments/${eventId}`, {
          headers: {
            'x-api-key': API_KEY
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments')
        }
        
        const comments = await response.json()
        this.commentsByEvent[eventId] = comments
      } catch (err) {
        console.error('Error fetching comments:', err)
        this.error = err.message
      } finally {
        this.loading[eventId] = false
      }
    },

    // Post a new comment
    async postComment(eventId, authorName, message) {
      this.error = null
      
      try {
        const response = await fetch(`${API_URL}/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            event_id: eventId,
            author_name: authorName,
            message: message
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to post comment')
        }
        
        const newComment = await response.json()
        
        // Add the new comment to the top of the list
        if (!this.commentsByEvent[eventId]) {
          this.commentsByEvent[eventId] = []
        }
        this.commentsByEvent[eventId].unshift(newComment)
        
        // Increment the comment count
        this.commentCounts[eventId] = (this.commentCounts[eventId] || 0) + 1
        
        return newComment
      } catch (err) {
        console.error('Error posting comment:', err)
        this.error = err.message
        throw err
      }
    }
  }
})
