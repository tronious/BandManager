export function PageHeader({ title, subtitle, children, textSize, textsize }) {
  const resolvedTextSize = textSize ?? textsize
  const titleStyle = resolvedTextSize ? { fontSize: resolvedTextSize } : undefined

  return (
    <div className="page-header">
      <h2 style={titleStyle}>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </div>
  )
}
