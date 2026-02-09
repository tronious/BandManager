import { useEffect, useState, useMemo } from 'react'
import { EventCard } from '@/components/EventCard/EventCard.jsx'
import { EventDetailsModal } from '@/components/EventDetailsModal/EventDetailsModal.jsx'
import { EmptyState } from '@/components/shared/EmptyState.jsx'
import { ErrorState } from '@/components/shared/ErrorState.jsx'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner.jsx'
import { PageHeader } from '@/components/shared/PageHeader.jsx'
import './EventsPage.css'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString || '')
    .split('-')
    .map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [includePastEvents, setIncludePastEvents] = useState(false)

  const visibleEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const normalized = Array.isArray(events) ? events : []

    const upcoming = []
    const past = []
    for (const evt of normalized) {
      const eventDate = parseLocalDate(evt?.date)
      if (eventDate && eventDate < today) past.push(evt)
      else upcoming.push(evt)
    }

    upcoming.sort((a, b) => (parseLocalDate(a?.date)?.getTime() || 0) - (parseLocalDate(b?.date)?.getTime() || 0))
    past.sort((a, b) => (parseLocalDate(b?.date)?.getTime() || 0) - (parseLocalDate(a?.date)?.getTime() || 0))

    return includePastEvents ? [...upcoming, ...past] : upcoming
  }, [events, includePastEvents])

  async function fetchEvents() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/events?includePast=1`, {
        headers: {
          'x-api-key': API_KEY,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="page">
      {/* <PageHeader textSize="1rem" title="Come see us play live!" /> */}

      <EventDetailsModal show={!!selectedEvent} event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {loading ? <LoadingSpinner message="Loading events..." /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={fetchEvents} /> : null}

      {!loading && !error && visibleEvents.length === 0 ? (
        <EmptyState icon="🎤" title="No events yet" message="Time to book some gigs!" />
      ) : null}

      {!loading && !error && visibleEvents.length > 0 ? (
        <>
          <div className="events-toolbar">
            <label className="events-toggle">
              <input
                type="checkbox"
                checked={includePastEvents}
                onChange={(e) => setIncludePastEvents(e.target.checked)}
              />
              Include past events
            </label>

            <div className="events-hint" role="note" aria-label="Tap an event for more info">
              Tap an event for details
            </div>
          </div>

          <div className="events-grid">
            {visibleEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                animationDelay={index * 0.1}
                commentCount={0}
                onOpenDetails={() => setSelectedEvent(event)}
                onOpenComments={() => {
                  // Comment modal port will come next
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

