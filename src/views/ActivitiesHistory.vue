<script setup>
import TheNavBar from "@/components/TheNavBar.vue";
import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
  <div class="flex flex-col h-screen">
    <TheHeader class="shrink-0" />

    <main class="flex-1 overflow-y-auto">
      <!-- Contenu de la page historique à ajouter ici -->
    </main>

    <TheNavBar class="shrink-0" />
  </div>
</template>

<style scoped></style>
