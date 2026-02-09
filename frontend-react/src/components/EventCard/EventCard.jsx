import './EventCard.css'

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function EventCard({
  event,
  animationDelay = 0,
  commentCount = 0,
  onOpenComments,
  onOpenDetails,
}) {
  const localDate = parseLocalDate(event?.date)
  const day = localDate.getDate()
  const month = localDate.toLocaleDateString('en-US', { month: 'short' })
  const fullDate = localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpenDetails?.(event)
    }
  }

  return (
    <article
      className="event-card"
      style={{ animationDelay: `${animationDelay}s` }}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails?.(event)}
      onKeyDown={handleKeyDown}
      aria-label={event?.name ? `Open details for ${event.name}` : 'Open event details'}
    >
      <div className="event-date">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>

      <div className="event-details">
        <h3 className="event-name">{event?.name}</h3>
        <p className="event-info">{fullDate}</p>
      </div>

      <button
        className="event-action"
        onClick={(e) => {
          e.stopPropagation()
          onOpenComments?.(event)
        }}
      >
        {/* <span>💬</span> */}
        <span className="action-text">Leave a Comment</span>
        {commentCount > 0 ? <span className="comment-count">{commentCount}</span> : null}
      </button>
    </article>
  )
}
