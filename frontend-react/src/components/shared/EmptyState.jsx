import './states.css'

export function EmptyState({ icon = '📭', title = 'Nothing here yet', message = '', children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {children}
    </div>
  )
}
