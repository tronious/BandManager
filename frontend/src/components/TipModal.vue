<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="tip-modal-overlay" @click.self="$emit('close')">
        <div class="tip-modal">
          <button class="tip-modal__close" @click.stop.prevent="$emit('close')" type="button">&times;</button>
          <a
            href="https://venmo.com/MarkMatthews1975"
            target="_blank"
            rel="noopener noreferrer"
            class="tip-modal__link"
          >
            <img src="@/assets/tJar.png" alt="Tip Jar" class="tip-modal__image" />
          </a>
        <p class="tip-modal__message" style="margin-top: -30px;"">Venmo a Tip!</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.tip-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.tip-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tip-modal__close {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.tip-modal__close:hover {
  opacity: 1;
}

.tip-modal__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 0;
}

.tip-modal__image {
  max-width: 300px;
  max-height: 60vh;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4));
  animation: float 3s ease-in-out infinite;
}

.tip-modal__message {
  font-size: 1.75rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin: 0;
  letter-spacing: 0.02em;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .tip-modal,
.modal-leave-to .tip-modal {
  transform: scale(0.9);
}

@media (max-width: 600px) {
  .tip-modal {
    padding: 1.5rem;
  }
  
  .tip-modal__image {
    max-width: 200px;
  }
  
  .tip-modal__message {
    font-size: 1.25rem;
  }
}
</style>
