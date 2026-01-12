// stores/comments.js
// Pinia store for managing event comments
// Handles fetching and posting comments through our backend API

import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

export const useCommentsStore = defineStore('comments', () => {
  // ============ STATE ============
  // Comments keyed by event ID for caching (hash map: eventId -> comments array)
  const commentsByEvent = ref({})
  // Comment counts keyed by event ID (hash map: eventId -> count)
  const commentCounts = ref({})
  // Loading state per event
  const loading = ref({})
  // Error state
  const error = ref(null)

  // ============ GETTERS ============
  // Get comments for a specific event
  function getComments(eventId) {
    return commentsByEvent.value[eventId] || []
  }

  // Get comment count for a specific event
  function getCommentCount(eventId) {
    return commentCounts.value[eventId] || 0
  }

  // Check if comments are loading for an event
  function isLoading(eventId) {
    return loading.value[eventId] || false
  }

  // ============ ACTIONS ============
  // Fetch comment counts for multiple events
  async function fetchCommentCounts(eventIds) {
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
      commentCounts.value = { ...commentCounts.value, ...counts }
    } catch (err) {
      console.error('Error fetching comment counts:', err)
    }
  }

  // Fetch comments for a specific event
  async function fetchComments(eventId) {
    loading.value[eventId] = true
    error.value = null

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
      commentsByEvent.value[eventId] = comments
    } catch (err) {
      console.error('Error fetching comments:', err)
      error.value = err.message
    } finally {
      loading.value[eventId] = false
    }
  }

  // Post a new comment
  async function postComment(eventId, authorName, message) {
    error.value = null

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
      if (!commentsByEvent.value[eventId]) {
        commentsByEvent.value[eventId] = []
      }
      commentsByEvent.value[eventId].unshift(newComment)

      // Increment the comment count
      commentCounts.value[eventId] = (commentCounts.value[eventId] || 0) + 1

      return newComment
    } catch (err) {
      console.error('Error posting comment:', err)
      error.value = err.message
      throw err
    }
  }

  // ============ RETURN ============
  // Expose everything that should be accessible from components
  return {
    // State
    commentsByEvent,
    commentCounts,
    loading,
    error,
    // Getters
    getComments,
    getCommentCount,
    isLoading,
    // Actions
    fetchCommentCounts,
    fetchComments,
    postComment
  }
})
