import { useEffect, useMemo, useRef, useState } from 'react'
import './BouncingNotes.css'

const NOTE_CONFIGS = [
  { symbol: '♪', size: 2.2, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.3 },
  { symbol: '♫', size: 3.0, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.35 },
  { symbol: '♪', size: 2.5, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.25 },
  { symbol: '♫', size: 2.7, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.3 },
  { symbol: '♪', size: 2.2, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.28 },
  { symbol: '♫', size: 3.5, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.32 },
  { symbol: '♪', size: 2.4, color: 'rgba(255, 255, 255, 0.7)', opacity: 0.25 },
  { symbol: '♫', size: 2.6, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.3 },
  { symbol: '♪', size: 2.8, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.35 },
  { symbol: '♫', size: 2.3, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.28 },
  { symbol: '♪', size: 3.0, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.3 },
  { symbol: '♫', size: 2.5, color: 'rgba(250, 204, 21, 0.8)', opacity: 0.32 },
  { symbol: '♪', size: 3.0, color: 'rgba(255, 255, 255, 0.7)', opacity: 0.25 },
  { symbol: '♫', size: 2.3, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.3 },
]

function makeInitialNotes() {
  return NOTE_CONFIGS.map((config, index) => ({
    id: index,
    ...config,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    rotationSpeed: 0,
  }))
}

export function BouncingNotes() {
  const containerRef = useRef(null)
  const animationIdRef = useRef(null)
  const notesRef = useRef(makeInitialNotes())
  const [, forceRender] = useState(0)

  const notes = useMemo(() => notesRef.current, [])

  function initNotes() {
    const width = containerRef.current?.clientWidth || window.innerWidth
    const height = containerRef.current?.clientHeight || window.innerHeight

    notesRef.current.forEach((note) => {
      note.x = Math.random() * (width - 50)
      note.y = Math.random() * (height - 50)

      const speed = 0.5 + Math.random() * 1.5
      const angle = Math.random() * Math.PI * 2
      note.vx = Math.cos(angle) * speed
      note.vy = Math.sin(angle) * speed

      note.rotation = Math.random() * 360
      note.rotationSpeed = (Math.random() - 0.5) * 2
    })

    forceRender((x) => x + 1)
  }

  function updatePhysics() {
    const width = containerRef.current?.clientWidth || window.innerWidth
    const height = containerRef.current?.clientHeight || window.innerHeight
    const noteSize = 40

    notesRef.current.forEach((note) => {
      note.x += note.vx
      note.y += note.vy
      note.rotation += note.rotationSpeed

      if (note.x <= 0) {
        note.x = 0
        note.vx = Math.abs(note.vx)
        note.rotationSpeed = (Math.random() - 0.5) * 4
      } else if (note.x >= width - noteSize) {
        note.x = width - noteSize
        note.vx = -Math.abs(note.vx)
        note.rotationSpeed = (Math.random() - 0.5) * 4
      }

      if (note.y <= 0) {
        note.y = 0
        note.vy = Math.abs(note.vy)
        note.rotationSpeed = (Math.random() - 0.5) * 2
      } else if (note.y >= height - noteSize) {
        note.y = height - noteSize
        note.vy = -Math.abs(note.vy)
        note.rotationSpeed = (Math.random() - 0.5) * 2
      }
    })

    forceRender((x) => x + 1)
    animationIdRef.current = requestAnimationFrame(updatePhysics)
  }

  useEffect(() => {
    initNotes()
    animationIdRef.current = requestAnimationFrame(updatePhysics)

    window.addEventListener('resize', initNotes)
    return () => {
      window.removeEventListener('resize', initNotes)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="notes-bg" aria-hidden="true" ref={containerRef}>
      {notes.map((note) => (
        <span
          key={note.id}
          className="note"
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
            fontSize: `${note.size}rem`,
            color: note.color,
            opacity: note.opacity,
            transform: `rotate(${note.rotation}deg)`,
          }}
        >
          {note.symbol}
        </span>
      ))}
    </div>
  )
}
