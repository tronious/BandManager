import './TipButton.css'

export function TipButton({onClick, ...props }) {
  return (
    <button {...props} className="tip-button" type="button" onClick={onClick}>
      <span className="tip-button__text">Tip the band</span>
    </button>
  )
}
