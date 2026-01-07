<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmClass: {
    type: String,
    default: 'bg-red-500 hover:bg-red-600'
  }
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const handleConfirm = () => {
  emit('confirm');
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
  emit('close');
};

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleCancel();
  }
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20 px-4"
      @click="handleBackdropClick"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <!-- Titre -->
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="text-sm text-gray-600 mb-6">
          {{ message }}
        </p>

        <!-- Boutons d'action -->
        <div class="flex gap-3 justify-end">
          <button
            @click="handleCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :class="['px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors', confirmClass]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
