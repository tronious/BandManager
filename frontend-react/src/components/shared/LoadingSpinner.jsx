import labelImg from '../../assets/tronrecord.png'
import './LoadingSpinner.css'

export function LoadingSpinner({ message, showMessage = false }) {
  return (
    <div className="loading-state">
      <div className="record-spinner">
        <img src={labelImg} alt="Tronious Label" className="record-label" />
      </div>
      {showMessage && message ? <p>{message}</p> : null}
    </div>
  )
}
