import './EventCard.css'

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function EventCard({ event, animationDelay = 0, commentCount = 0, onOpenComments }) {
  const localDate = parseLocalDate(event?.date)
  const day = localDate.getDate()
  const month = localDate.toLocaleDateString('en-US', { month: 'short' })
  const fullDate = localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="event-card" style={{ animationDelay: `${animationDelay}s` }}>
      <div className="event-date">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>

      <div className="event-details">
        <h3 className="event-name">{event?.name}</h3>
        <p className="event-info">{fullDate}</p>
      </div>

      <button className="event-action" onClick={onOpenComments}>
        <span>💬</span>
        <span className="action-text">Leave a Comment</span>
        {commentCount > 0 ? <span className="comment-count">{commentCount}</span> : null}
      </button>
    </article>
  )
}
