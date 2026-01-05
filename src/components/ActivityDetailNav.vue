<script setup>
import { ref } from 'vue';

const props = defineProps({
  onBack: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
});

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleDelete = () => {
  showMenu.value = false;
  props.onDelete();
};
</script>

<template>
  <div class="flex w-full h-[50px] px-4 sm:px-6 md:px-8 justify-between items-center relative">
    <button
      @click="onBack"
      class="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      aria-label="Retour"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-gray-800"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Menu avec fond blanc circulaire -->
    <div class="relative">
      <button
        @click="toggleMenu"
        class="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        aria-label="Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="text-gray-800"
        >
          <circle cx="12" cy="6" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <!-- Menu déroulant -->
      <div
        v-if="showMenu"
        class="absolute top-[45px] right-0 bg-white rounded-lg shadow-lg min-w-[200px] z-[1000] overflow-hidden"
      >
        <button
          @click="handleDelete"
          class="w-full px-4 py-3 border-none bg-white text-left cursor-pointer text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
        >
          Supprimer l'activité
        </button>
      </div>
    </div>
  </div>
</template>
