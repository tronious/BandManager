import './TipButton.css'

export function TipButton({ onClick }) {
  return (
    <button className="tip-button" type="button" onClick={onClick}>
      <span className="tip-button__text">TIP THE BAND</span>
    </button>
  )
}
