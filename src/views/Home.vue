<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheNavBar from "@/components/TheNavBar.vue";
import ActivityPreview from "@/components/ActivityPreview.vue";
import WeekPreview from "../components/WeekPreview.vue";
import ToastNotification from "@/components/ToastNotification.vue";
import { useToast } from "@/composables/useToast.js";

const route = useRoute();
const router = useRouter();
const { addToast } = useToast();

// Vérifier si on revient d'une suppression
onMounted(() => {
  if (route.query.deleted === "true") {
    addToast("Activité supprimée avec succès", "success");
    // Nettoyer le paramètre de l'URL
    router.replace({ query: {} });
  }
});
</script>

<template>
  <TheHeader/>
  <div class="flex flex-col h-screen">
    <TheHeader class="shrink-0" />
    <ToastNotification />
    <main class="flex-1 overflow-y-auto">
      <WeekPreview :activities="activities" />
      <CommunityWidget/>
      <ActivityPreview :activities="activities" />
    </main>
    <TheNavBar class="shrink-0" />
  </div>
</template>

<style scoped></style>
