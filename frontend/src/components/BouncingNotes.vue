<!-- BouncingNotes.vue -->
<!-- Physics-based bouncing music notes that bounce off screen edges -->
<template>
  <div class="notes-bg" aria-hidden="true" ref="container">
    <span
      v-for="note in notes"
      :key="note.id"
      class="note"
      :style="{
        left: note.x + 'px',
        top: note.y + 'px',
        fontSize: note.size + 'rem',
        color: note.color,
        opacity: note.opacity,
        transform: `rotate(${note.rotation}deg)`
      }"
    >{{ note.symbol }}</span>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const container = ref(null)
let animationId = null

// Note configurations
const noteConfigs = [
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
  { symbol: '♫', size: 2.3, color: 'rgba(248, 113, 113, 0.8)', opacity: 0.3 }
]

// Create reactive notes array
const notes = reactive(noteConfigs.map((config, i) => ({
  id: i,
  ...config,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  rotation: 0,
  rotationSpeed: 0
})))

// Initialize note positions and velocities
function initNotes() {
  const width = container.value?.clientWidth || window.innerWidth
  const height = container.value?.clientHeight || window.innerHeight
  
  notes.forEach((note, i) => {
    // Random starting position
    note.x = Math.random() * (width - 50)
    note.y = Math.random() * (height - 50)
    
    // Random velocity (speed between 0.5 and 2 pixels per frame)
    const speed = 0.5 + Math.random() * 1.5
    const angle = Math.random() * Math.PI * 2
    note.vx = Math.cos(angle) * speed
    note.vy = Math.sin(angle) * speed
    
    // Random rotation
    note.rotation = Math.random() * 360
    note.rotationSpeed = (Math.random() - 0.5) * 2
  })
}

// Physics update loop
function updatePhysics() {
  const width = container.value?.clientWidth || window.innerWidth
  const height = container.value?.clientHeight || window.innerHeight
  const noteSize = 40 // Approximate note size in pixels
  
  notes.forEach(note => {
    // Update position
    note.x += note.vx
    note.y += note.vy
    
    // Update rotation
    note.rotation += note.rotationSpeed
    
    // Bounce off left/right edges
    if (note.x <= 0) {
      note.x = 0
      note.vx = Math.abs(note.vx)
      note.rotationSpeed = (Math.random() - 0.5) * 4
    } else if (note.x >= width - noteSize) {
      note.x = width - noteSize
      note.vx = -Math.abs(note.vx)
      note.rotationSpeed = (Math.random() - 0.5) * 4
    }
    
    // Bounce off top/bottom edges
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
  
  animationId = requestAnimationFrame(updatePhysics)
}

onMounted(() => {
  initNotes()
  animationId = requestAnimationFrame(updatePhysics)
  
  // Reinitialize on window resize
  window.addEventListener('resize', initNotes)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', initNotes)
})
</script>

<style scoped>
.notes-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.note {
  position: absolute;
  will-change: transform, left, top;
  transition: none;
}
</style>
