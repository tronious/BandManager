<!-- TipJar.vue -->
<!-- Floating tip jar button that links to Venmo -->
<template>
  <a
    href="https://venmo.com/MarkMatthews1975"
    target="_blank"
    rel="noopener noreferrer"
    class="tip-jar"
  >
    <img src="@/assets/tJar.png" alt="Tip Jar" class="tip-jar__icon" />
    <img src="@/assets/venmo-logo-2.png" alt="Venmo" class="venmo-logo" />
  </a>
</template>

<script setup>
</script>

<style scoped>
.tip-jar {
  position: fixed;
  bottom: 2rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.tip-jar:hover {
  transform: translateY(-5px) scale(1.08);
}

.tip-jar:hover .tip-jar__icon {
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
}

.tip-jar__icon {
  width: 150px;
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
  animation: wiggle 2.5s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

.venmo-logo {
  width: 80px;
    width: 80px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
      position: absolute;
      bottom:10px;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .tip-jar {
    bottom: 1rem;
    right: 1rem;
  }
  
  .tip-jar__icon {
    width: 60px;
  }
}
</style>
