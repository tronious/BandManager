<template>
  <button class="tip-button" @click="$emit('click')">
    <span class="tip-button__text">TIP THE BAND</span>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.tip-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    linear-gradient(135deg, rgba(0, 140, 255, 0.85) 0%, rgba(0, 180, 150, 0.85) 100%),
    url('@/assets/venmo-logo-2.png') center/contain no-repeat;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 140, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.tip-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('@/assets/venmo-logo-2.png') center/24px no-repeat;
  opacity: 0.2;
  filter: brightness(0) invert(1);
}

.tip-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 140, 255, 0.5);
}

.tip-button:active {
  transform: translateY(0) scale(0.98);
}

.tip-button__text {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .tip-button {
    padding: 0.5rem 0.75rem;
  }
  
  .tip-button__text {
    font-size: 0.7rem;
  }
}
</style>
