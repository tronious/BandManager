import { useEffect } from 'react'
import './EventDetailsModal.css'

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString || '')
    .split('-')
    .map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function normalizeUrl(url) {
  const raw = String(url || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}

function buildGoogleMapsUrl(event) {
  const queryParts = [event?.address, event?.venue, event?.name].filter(Boolean)
  const query = queryParts.join(' - ').trim()
  if (!query) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function EventDetailsModal({ show, event, onClose }) {
  useEffect(() => {
    if (!show) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [show, onClose])

  if (!show || !event) return null

  const localDate = parseLocalDate(event?.date)
  const fullDate = localDate
    ? localDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const time = event?.time || event?.start_time || event?.startTime || ''
  const address = event?.address || event?.location || ''
  const venue = event?.venue || ''
  const description = event?.description || event?.notes || event?.description_notes || ''

  const ticketUrl = normalizeUrl(event?.ticket_url || event?.ticketUrl)
  const mapsUrl = buildGoogleMapsUrl({ ...event, address: address || venue })

  return (
    <div className="event-details-overlay" onClick={(e) => (e.target === e.currentTarget ? onClose?.() : null)}>
      <div className="event-details-modal" role="dialog" aria-modal="true" aria-label="Event details">
        <button type="button" className="event-details-close" onClick={() => onClose?.()} aria-label="Close">
          ×
        </button>

        <h2 className="event-details-title">{event?.name || 'Event Details'}</h2>

        <div className="event-details-body">
          {fullDate ? (
            <div className="event-details-row">
              <div className="event-details-label">Date</div>
              <div className="event-details-value">{fullDate}</div>
            </div>
          ) : null}

          {time ? (
            <div className="event-details-row">
              <div className="event-details-label">Time</div>
              <div className="event-details-value">{time}</div>
            </div>
          ) : null}

          {venue ? (
            <div className="event-details-row">
              <div className="event-details-label">Venue</div>
              <div className="event-details-value">{venue}</div>
            </div>
          ) : null}

          {address ? (
            <div className="event-details-row">
              <div className="event-details-label">Address</div>
              <div className="event-details-value">{address}</div>
            </div>
          ) : null}

          {description ? (
            <div className="event-details-row event-details-notes">
              <div className="event-details-label">Details</div>
              <div className="event-details-value">{description}</div>
            </div>
          ) : null}

          <div className="event-details-actions">
            {mapsUrl ? (
              <a className="event-details-btn" href={mapsUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            ) : null}

            {ticketUrl ? (
              <a className="event-details-btn secondary" href={ticketUrl} target="_blank" rel="noreferrer">
                Tickets / Info
              </a>
            ) : null}

            <button type="button" className="event-details-btn ghost" onClick={() => onClose?.()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
