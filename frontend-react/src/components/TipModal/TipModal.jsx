import { useEffect } from 'react'
import './TipModal.css'

const VENMO_URL = 'https://venmo.com/MarkMatthews1975'

export function TipModal({ show, onClose }) {
  useEffect(() => {
    if (!show) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="tip-modal-overlay" onClick={(e) => (e.target === e.currentTarget ? onClose?.() : null)}>
      <div className="tip-modal" role="dialog" aria-modal="true" aria-label="Tip the band">
        <button className="tip-modal__close" onClick={onClose} type="button" aria-label="Close">
          ×
        </button>
        <a href={VENMO_URL} target="_blank" rel="noopener noreferrer" className="tip-modal__link">
          <img src={new URL('@/assets-vue/tJar.png', import.meta.url).toString()} alt="Tip Jar" className="tip-modal__image" />
        </a>
        <p className="tip-modal__message">Venmo a Tip!</p>
      </div>
    </div>
  )
}
