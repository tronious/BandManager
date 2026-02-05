import { useSelector } from 'react-redux'
import { LoadingSpinner } from '../LoadingSpinner.jsx'
import './GlobalLoadingOverlay.css'

export function GlobalLoadingOverlay() {
  const loading = useSelector((state) => state.ui?.loading)
  const message = useSelector((state) => state.ui?.loadingMessage)

  if (!loading) return null

  return (
    <div className="global-loading-overlay" role="status" aria-live="polite">
      <LoadingSpinner message={message} />
    </div>
  )
}
