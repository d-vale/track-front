<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  choices: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(choice =>
        typeof choice.label === 'string'
      );
    }
  }
});

const emit = defineEmits(['select', 'close']);

const handleChoice = (choice, index) => {
  emit('select', { choice, index });
  emit('close');
};

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    emit('close');
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
        <h3 class="text-lg font-bold text-gray-900 mb-6">
          {{ title }}
        </h3>

        <!-- Choix -->
        <div class="flex flex-col gap-3">
          <button
            v-for="(choice, index) in choices"
            :key="index"
            @click="handleChoice(choice, index)"
            class="flex items-center gap-4 px-4 py-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <!-- Icône -->
            <div class="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow text-gray-700">
              <div v-html="choice.icon" class="w-6 h-6"></div>
            </div>
            <!-- Label -->
            <span class="text-sm font-medium text-gray-900">
              {{ choice.label }}
            </span>
          </button>
        </div>

        <!-- Bouton annuler -->
        <div class="mt-6 flex justify-end">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
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
