import labelImg from '@/assets-vue/tronious.jpg'
import './LoadingSpinner.css'

export function LoadingSpinner({ message }) {
  return (
    <div className="loading-state">
      <div className="record-spinner">
        <div className="record-grooves" />
        <img src={labelImg} alt="Tronious Label" className="record-label" />
        <div className="spindle-hole" />
      </div>
      {message ? <p>{message}</p> : null}
    </div>
  )
}
