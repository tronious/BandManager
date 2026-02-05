import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader.jsx'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner.jsx'
import { ErrorState } from '@/components/shared/ErrorState.jsx'
import './PicsPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString || '')
    .split('-')
    .map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatEventLabel(event) {
  const date = parseLocalDate(event?.date)
  const dateLabel = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
  // Keep this short; native select popups get ugly with long lines.
  return `${dateLabel} — ${event?.name || ''}`.trim()
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

function PhotoLightbox({ open, photos, index, onClose, onChangeIndex }) {
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') onChangeIndex?.((index - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') onChangeIndex?.((index + 1) % photos.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, index, photos.length, onClose, onChangeIndex])

  const [touchStartX, setTouchStartX] = useState(null)

  if (!open) return null
  const photo = photos[index]
  if (!photo) return null

  function prev() {
    onChangeIndex?.((index - 1 + photos.length) % photos.length)
  }

  function next() {
    onChangeIndex?.((index + 1) % photos.length)
  }

  function onTouchStart(e) {
    const x = e.touches?.[0]?.clientX
    if (typeof x === 'number') setTouchStartX(x)
  }

  function onTouchEnd(e) {
    const x = e.changedTouches?.[0]?.clientX
    if (typeof x !== 'number' || typeof touchStartX !== 'number') return
    const delta = x - touchStartX
    const threshold = 50
    if (delta > threshold) prev()
    if (delta < -threshold) next()
    setTouchStartX(null)
  }

  return (
    <div className="lightbox" onClick={(e) => (e.target === e.currentTarget ? onClose?.() : null)}>
      <button type="button" className="lightbox-close" onClick={() => onClose?.()} aria-label="Close">
        ×
      </button>

      <button type="button" className="lightbox-nav left" onClick={prev} aria-label="Previous photo">
        ‹
      </button>

      <div className="lightbox-content" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img className="lightbox-img" src={photo.url} alt={photo.caption || 'Event photo'} />
        <div className="lightbox-meta">
          <div className="lightbox-count">
            {index + 1} / {photos.length}
          </div>
          {photo.caption ? <div className="lightbox-caption">{photo.caption}</div> : null}
        </div>
      </div>

      <button type="button" className="lightbox-nav right" onClick={next} aria-label="Next photo">
        ›
      </button>
    </div>
  )
}

export function PicsPage() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')

  const [photos, setPhotos] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const selectedEvent = useMemo(() => events.find((e) => String(e.id) === String(selectedEventId)), [events, selectedEventId])

  async function apiFetch(path, options = {}) {
    if (!API_KEY) throw new Error('Missing VITE_API_KEY in your environment.')

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'x-api-key': API_KEY,
        ...(options.headers || {}),
      },
    })

    return response
  }

  async function fetchEvents() {
    setLoadingEvents(true)
    setError('')
    try {
      const response = await apiFetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      const list = Array.isArray(data) ? data : []
      setEvents(list)
      if (!selectedEventId && list.length > 0) setSelectedEventId(String(list[0].id))
    } catch (err) {
      setError(err?.message || 'Failed to load events')
    } finally {
      setLoadingEvents(false)
    }
  }

  async function fetchPhotos(eventId) {
    if (!eventId) return
    setLoadingPhotos(true)
    setError('')
    try {
      const response = await apiFetch(`/api/events/${eventId}/photos`)
      if (!response.ok) throw new Error('Failed to fetch photos')
      const data = await response.json()
      setPhotos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load photos')
      setPhotos([])
    } finally {
      setLoadingPhotos(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedEventId) fetchPhotos(selectedEventId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId])

  async function uploadFiles(fileList) {
    const files = Array.from(fileList || [])
    if (!selectedEventId || files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const created = []
      for (const file of files) {
        const form = new FormData()
        form.append('photo', file)

        const response = await apiFetch(`/api/events/${selectedEventId}/photos`, {
          method: 'POST',
          body: form,
        })

        if (!response.ok) {
          let message = 'Upload failed'
          try {
            const body = await response.json()
            message = body?.error || message
          } catch {
            // ignore
          }
          throw new Error(message)
        }

        const photo = await response.json()
        created.push(photo)
      }

      setPhotos((prev) => [...created, ...prev])
    } catch (err) {
      setError(err?.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  function openLightbox(i) {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  return (
    <div className="page">
      <PageHeader title="PICS!" subtitle="Upload photos from the show" />

      {loadingEvents ? <LoadingSpinner message="Loading events..." /> : null}
      {!loadingEvents && error ? <ErrorState message={error} onRetry={fetchEvents} /> : null}

      {!loadingEvents && events.length > 0 ? (
        <div className="pics-controls">
          <label className="pics-label" htmlFor="picsEvent">
            Pick an event
          </label>
          <select
            id="picsEvent"
            className="pics-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {formatEventLabel(e)}
              </option>
            ))}
          </select>

          <label className={`upload-btn ${uploading ? 'disabled' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={!selectedEventId || uploading}
              onChange={(e) => {
                uploadFiles(e.target.files)
                e.target.value = ''
              }}
            />
            {uploading ? 'Uploading…' : 'Upload photos'}
          </label>

          {selectedEvent ? <div className="pics-selected">{selectedEvent.name}</div> : null}
        </div>
      ) : null}

      {loadingPhotos ? <LoadingSpinner message="Loading photos..." /> : null}

      {!loadingPhotos && !error ? (
        <div className="pics-grid">
          {photos.map((p, i) => (
            <button key={p.id || p.url || i} type="button" className="pics-thumb" onClick={() => openLightbox(i)}>
              <img src={p.url} alt={p.caption || 'Event photo'} loading="lazy" />
            </button>
          ))}

          {!selectedEventId ? <div className="pics-empty">Pick an event to see photos.</div> : null}
          {selectedEventId && photos.length === 0 ? (
            <div className="pics-empty">No photos yet — be the first!</div>
          ) : null}
        </div>
      ) : null}

      <PhotoLightbox
        open={lightboxOpen}
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onChangeIndex={(i) => setLightboxIndex(i)}
      />
    </div>
  )
}
