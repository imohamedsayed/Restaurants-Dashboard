<template>
  <teleport to="body">
    <transition name="modal-outer">
      <div v-show="modalActive" class="modal-overlay">
        <transition name="modal-inner">
          <div v-if="modalActive" class="modal-content text-center">
            <slot />
            <button class="modal-button rounded-pill" @click="$emit('close')">
              Close
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineEmits(["close"]);
defineProps({
  modalActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(black, 0.3);
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
.modal-content {
  background-color: #fff !important;
  align-items: left !important;
  padding: 4px !important;
  margin-top: 32px !important;
  max-width: 620px !important;
  height: 200px;
  border-radius: 20px !important;
}
.modal-button {
  color: white;
  width: 100px;
  height: 40px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 6px;
  background-color: var(--primary);
}
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>
