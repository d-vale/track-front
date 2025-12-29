<script setup>
import TheNavBar from "@/components/TheNavBar.vue";
import ActivityPreview from "@/components/ActivityPreview.vue";
import TheHeader from "@/components/TheHeader.vue";
import WeekPreview from "../components/WeekPreview.vue";
</script>

<template>
  <div class="flex flex-col h-screen">
    <TheHeader class="shrink-0" />
    <main class="flex-1 overflow-y-auto">
      <WeekPreview/>
      <ActivityPreview/>
    </main>
    <TheNavBar class="shrink-0" />
  </div>
</template>

<style scoped></style>
