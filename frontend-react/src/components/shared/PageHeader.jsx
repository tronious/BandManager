export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </div>
  )
}
