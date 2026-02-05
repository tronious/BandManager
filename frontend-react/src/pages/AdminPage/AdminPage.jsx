import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader.jsx'
import { hideLoading, showLoading } from '@/store/slices/uiSlice.js'
import { useApp } from '@/providers/AppProvider.jsx'
import './AdminPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

function isPastEvent(date) {
  const [year, month, day] = String(date || '')
    .split('-')
    .map(Number)
  const eventDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate < today
}

function formatDate(dateString) {
  const [year, month, day] = String(dateString || '')
    .split('-')
    .map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setShowAdminLogin } = useApp()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
    ticket_url: '',
  })
  const [editingEvent, setEditingEvent] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const [photoEventId, setPhotoEventId] = useState('')
  const [eventPhotos, setEventPhotos] = useState([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [showPhotoDeleteModal, setShowPhotoDeleteModal] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState(null)

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [events])

  function getPassword() {
    return sessionStorage.getItem('adminPassword')
  }

  async function adminFetch(path, options = {}) {
    if (!API_KEY) throw new Error('Missing VITE_API_KEY in your environment.')

    const password = getPassword()
    if (!password) {
      const err = new Error('Not authenticated')
      err.code = 'NO_AUTH'
      throw err
    }

    const headers = {
      'x-api-key': API_KEY,
      'x-admin-password': password,
      ...(options.headers || {}),
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers })
    if (response.ok) return response

    if (response.status === 401 || response.status === 403) {
      sessionStorage.removeItem('adminPassword')
      const err = new Error('Admin access denied. Please log in again.')
      err.code = 'AUTH'
      throw err
    }

    let message = 'Request failed'
    try {
      const body = await response.json()
      message = body?.error || message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  function resetForm() {
    setForm({
      name: '',
      date: '',
      venue: '',
      description: '',
      ticket_url: '',
    })
    setEditingEvent(null)
  }

  function requireAuthOrPrompt() {
    const password = getPassword()
    if (!password) {
      setShowAdminLogin(true)
      return false
    }
    return true
  }

  async function fetchEvents() {
    if (!requireAuthOrPrompt()) return

    setLoading(true)
    setError('')
    dispatch(showLoading({ message: 'Loading events...' }))
    try {
      const response = await adminFetch('/api/admin/events')
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to fetch events')
      if (err?.code === 'AUTH' || err?.code === 'NO_AUTH') setShowAdminLogin(true)
    } finally {
      dispatch(hideLoading())
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!photoEventId && sortedEvents.length > 0) {
      setPhotoEventId(String(sortedEvents[0].id))
    }
  }, [photoEventId, sortedEvents])

  async function fetchEventPhotos(eventId) {
    if (!requireAuthOrPrompt()) return
    if (!eventId) return

    setPhotosLoading(true)
    setPhotosError('')
    try {
      const response = await adminFetch(`/api/admin/events/${eventId}/photos`)
      const data = await response.json()
      setEventPhotos(Array.isArray(data) ? data : [])
    } catch (err) {
      setPhotosError(err?.message || 'Failed to fetch photos')
      if (err?.code === 'AUTH' || err?.code === 'NO_AUTH') setShowAdminLogin(true)
      setEventPhotos([])
    } finally {
      setPhotosLoading(false)
    }
  }

  useEffect(() => {
    if (photoEventId) fetchEventPhotos(photoEventId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoEventId])

  function confirmDeletePhoto(photo) {
    setPhotoToDelete(photo)
    setShowPhotoDeleteModal(true)
  }

  async function onDeletePhoto() {
    if (!photoToDelete) return
    if (!requireAuthOrPrompt()) return

    dispatch(showLoading({ message: 'Deleting photo...' }))
    setPhotosError('')

    try {
      await adminFetch(`/api/admin/events/${photoEventId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: photoToDelete.id,
          storage_path: photoToDelete.storage_path || (String(photoToDelete.id || '').includes('/') ? photoToDelete.id : undefined),
        }),
      })

      const idToRemove = photoToDelete.id
      const pathToRemove = photoToDelete.storage_path || photoToDelete.id
      setEventPhotos((prev) => prev.filter((p) => p.id !== idToRemove && p.storage_path !== pathToRemove))

      setShowPhotoDeleteModal(false)
      setPhotoToDelete(null)
    } catch (err) {
      setPhotosError(err?.message || 'Failed to delete photo')
      if (err?.code === 'AUTH' || err?.code === 'NO_AUTH') setShowAdminLogin(true)
    } finally {
      dispatch(hideLoading())
    }
  }

  function PhotoThumb({ photo }) {
    const [pressing, setPressing] = useState(false)
    const timerRef = useState({ t: null })[0]

    function startPress() {
      setPressing(true)
      timerRef.t = setTimeout(() => {
        timerRef.t = null
        setPressing(false)
        confirmDeletePhoto(photo)
      }, 550)
    }

    function cancelPress() {
      setPressing(false)
      if (timerRef.t) {
        clearTimeout(timerRef.t)
        timerRef.t = null
      }
    }

    return (
      <button
        type="button"
        className={`admin-photo-thumb${pressing ? ' pressing' : ''}`}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => {
          e.preventDefault()
          cancelPress()
          confirmDeletePhoto(photo)
        }}
        onClick={() => {
          // Regular click opens in a new tab (long-press deletes)
          if (photo?.url) window.open(photo.url, '_blank', 'noreferrer')
        }}
        aria-label="Photo (long-press to delete)"
        title="Long-press to delete"
      >
        <img src={photo.url} alt={photo.caption || 'Event photo'} loading="lazy" />
        <span className="admin-photo-hint">Hold to delete</span>
      </button>
    )
  }

  function onEditEvent(event) {
    setEditingEvent(event)
    setForm({
      name: event.name,
      date: event.date,
      venue: event.venue || '',
      description: event.description || '',
      ticket_url: event.ticket_url || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onSaveEvent(e) {
    e.preventDefault()
    if (!requireAuthOrPrompt()) return

    dispatch(showLoading({ message: editingEvent ? 'Updating event...' : 'Adding event...' }))
    setError('')

    try {
      if (editingEvent) {
        const response = await adminFetch(`/api/admin/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const updated = await response.json()
        setEvents((prev) => prev.map((evt) => (evt.id === editingEvent.id ? updated : evt)))
      } else {
        const response = await adminFetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const created = await response.json()
        setEvents((prev) => [...prev, created])
      }

      resetForm()
    } catch (err) {
      setError(err?.message || 'Failed to save event')
      if (err?.code === 'AUTH' || err?.code === 'NO_AUTH') setShowAdminLogin(true)
    } finally {
      dispatch(hideLoading())
    }
  }

  function confirmDelete(event) {
    setEventToDelete(event)
    setShowDeleteModal(true)
  }

  async function onDeleteEvent() {
    if (!eventToDelete) return
    if (!requireAuthOrPrompt()) return

    dispatch(showLoading({ message: 'Deleting event...' }))
    setError('')

    try {
      await adminFetch(`/api/admin/events/${eventToDelete.id}`, { method: 'DELETE' })
      setEvents((prev) => prev.filter((evt) => evt.id !== eventToDelete.id))
      setShowDeleteModal(false)
      setEventToDelete(null)
    } catch (err) {
      setError(err?.message || 'Failed to delete event')
      if (err?.code === 'AUTH' || err?.code === 'NO_AUTH') setShowAdminLogin(true)
    } finally {
      dispatch(hideLoading())
    }
  }

  function logout() {
    sessionStorage.removeItem('adminPassword')
    setEvents([])
    resetForm()
    navigate('/events')
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <PageHeader title="🎛️ Backstage Control Panel" subtitle="Manage gigs and keep the calendar fresh." />
        <button type="button" onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="event-form-card">
        <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>

        <form onSubmit={onSaveEvent} className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventName">Event Name *</label>
              <input
                id="eventName"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                type="text"
                placeholder="e.g. King Seat Tavern"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventDate">Date *</label>
              <input
                id="eventDate"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                type="date"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventVenue">Venue</label>
              <input
                id="eventVenue"
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                type="text"
                placeholder="e.g. Downtown Nashville"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventTicketUrl">Ticket URL</label>
              <input
                id="eventTicketUrl"
                value={form.ticket_url}
                onChange={(e) => setForm((f) => ({ ...f, ticket_url: e.target.value }))}
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tell fans about this event..."
              rows={3}
            />
          </div>

          {error ? <p className="admin-error">{error}</p> : null}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
            </button>
            {editingEvent ? (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="events-section">
        <h2>Manage Events</h2>

        {loading && !events.length ? <div className="loading">Loading events...</div> : null}
        {!loading && !events.length ? (
          <div className="no-events">No events yet. Add your first gig above! 🎸</div>
        ) : null}

        {events.length ? (
          <div className="events-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEvents.map((event) => (
                  <tr key={event.id} className={isPastEvent(event.date) ? 'past-event' : ''}>
                    <td>{event.name}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.venue || '-'}</td>
                    <td className="actions">
                      <button type="button" onClick={() => onEditEvent(event)} className="edit-btn" title="Edit">
                        ✏️
                      </button>
                      <button type="button" onClick={() => confirmDelete(event)} className="delete-btn" title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="photos-section">
        <h2>Manage Photos</h2>

        {sortedEvents.length ? (
          <div className="photos-controls">
            <label className="photos-label" htmlFor="photoEvent">
              Event
            </label>
            <select
              id="photoEvent"
              className="photos-select"
              value={photoEventId}
              onChange={(e) => setPhotoEventId(e.target.value)}
            >
              {sortedEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {formatDate(event.date)} — {event.name}
                </option>
              ))}
            </select>

            <button type="button" className="photos-refresh" onClick={() => fetchEventPhotos(photoEventId)}>
              Refresh
            </button>
          </div>
        ) : (
          <div className="no-events">Add an event first to manage photos.</div>
        )}

        {photosError ? <p className="admin-error">{photosError}</p> : null}

        {photosLoading ? <div className="loading">Loading photos...</div> : null}

        {!photosLoading && photoEventId && eventPhotos.length === 0 ? (
          <div className="no-events">No photos for this event yet.</div>
        ) : null}

        {!photosLoading && eventPhotos.length ? (
          <div className="admin-photos-grid">
            {eventPhotos.map((p) => (
              <PhotoThumb key={p.id || p.storage_path || p.url} photo={p} />
            ))}
          </div>
        ) : null}

        {eventPhotos.length ? (
          <p className="photos-help">Tip: long-press a photo (or right-click) to delete it.</p>
        ) : null}
      </div>

      {showDeleteModal ? (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Delete event confirmation">
          <div className="admin-modal">
            <button
              className="admin-modal-close"
              type="button"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="delete-confirm">
              <h3>🗑️ Delete Event?</h3>
              <p>Are you sure you want to delete "{eventToDelete?.name}"?</p>
              <p className="warning">This cannot be undone!</p>
              <div className="modal-actions">
                <button type="button" onClick={onDeleteEvent} className="confirm-delete-btn">
                  Yes, Delete
                </button>
                <button type="button" onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showPhotoDeleteModal ? (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Delete photo confirmation">
          <div className="admin-modal">
            <button
              className="admin-modal-close"
              type="button"
              onClick={() => setShowPhotoDeleteModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="delete-confirm">
              <h3>🗑️ Delete Photo?</h3>
              {photoToDelete?.url ? <img className="admin-photo-preview" src={photoToDelete.url} alt="Preview" /> : null}
              <p className="warning">This cannot be undone!</p>
              <div className="modal-actions">
                <button type="button" onClick={onDeletePhoto} className="confirm-delete-btn">
                  Yes, Delete
                </button>
                <button type="button" onClick={() => setShowPhotoDeleteModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
