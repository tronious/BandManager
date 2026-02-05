import { useEffect, useState } from 'react'
import { EventCard } from '@/components/EventCard/EventCard.jsx'
import { EmptyState } from '@/components/shared/EmptyState.jsx'
import { ErrorState } from '@/components/shared/ErrorState.jsx'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner.jsx'
import { PageHeader } from '@/components/shared/PageHeader.jsx'
import './EventsPage.css'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchEvents() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/events`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page">
      <PageHeader title="Come see us play live!" />

      {loading ? <LoadingSpinner message="Loading events..." /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={fetchEvents} /> : null}

      {!loading && !error && events.length === 0 ? (
        <EmptyState icon="🎤" title="No events yet" message="Time to book some gigs!" />
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              animationDelay={index * 0.1}
              commentCount={0}
              onOpenComments={() => {
                // Comment modal port will come next
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

