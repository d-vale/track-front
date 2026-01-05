<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import ActivityDetailNav from "@/components/ActivityDetailNav.vue";
import { useFetchJson } from "../composables/useFetchJson.js";
import { getAuthHeaders } from "@/helpers/authHelper.js";
import polyline from "@mapbox/polyline";

const route = useRoute();
const router = useRouter();

// ID de l'activité depuis les paramètres de l'URL
const activityId = route.params.id;

// État de l'activité
const activity = ref(null);
const loading = ref(true);

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoiay1zZWwiLCJhIjoiY21qcXlycDJ3M3hlcjNlcXhyMThlZWZydCJ9.uDpE5Dw1is7vJOmVzVXHGQ";

// Fetch de l'activité spécifique
const { data, error, execute } = useFetchJson({
  url: `/api/activities/${activityId}`,
  method: "GET",
  immediate: false,
});

// Générer l'URL de l'image statique Mapbox
const getStaticMapUrl = (encodedPolyline) => {
  if (!encodedPolyline) return null;

  try {
    const coordinates = polyline.decode(encodedPolyline);

    // Calculer les bounds
    let minLat = coordinates[0][0],
      maxLat = coordinates[0][0];
    let minLng = coordinates[0][1],
      maxLng = coordinates[0][1];

    coordinates.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 13;
    if (maxDiff > 0.1) zoom = 11;
    if (maxDiff > 0.2) zoom = 10;
    if (maxDiff > 0.5) zoom = 9;
    if (maxDiff < 0.05) zoom = 14;
    if (maxDiff < 0.01) zoom = 15;

    const pathEncoded = encodeURIComponent(
      `path-3+FF8C00-0.9(${encodedPolyline})`
    );
    const width = 1200;
    const height = 800;
    const url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${pathEncoded}/auto/${width}x${height}@2x?access_token=${MAPBOX_ACCESS_TOKEN}&attribution=false&logo=false`;

    return url;
  } catch (err) {
    console.error("Erreur lors de la génération de l'URL de la carte:", err);
    return null;
  }
};

// Image de la carte
const mapImageUrl = computed(() => {
  if (activity.value?.encodedPolyline) {
    return getStaticMapUrl(activity.value.encodedPolyline);
  }
  return null;
});

// Formater la date et l'heure
const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} à ${time}`;
};

// Formater la distance en km
const formatDistance = (meters) => {
  return (meters / 1000).toFixed(2);
};

// Formater la durée
const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
};

// Charger l'activité
onMounted(async () => {
  loading.value = true;
  await execute();

  if (data.value) {
    // L'API retourne { success: true, data: {...} }
    activity.value = data.value.data || data.value;
  }

  loading.value = false;
});

// Retour à la page précédente
const goBack = () => {
  router.back();
};

// Supprimer l'activité
const deleteActivity = async () => {
  try {
    const response = await fetch(`/api/activities/${activityId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      router.push("/home"); // Retour à la page d'accueil après suppression
    }
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    alert("Erreur lors de la suppression de l'activité");
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />

    <!-- État de chargement -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-sm font-medium">Chargement de l'activité...</p>
    </div>

    <!-- État d'erreur -->
    <div
      v-else-if="error"
      class="flex-1 flex items-center justify-center text-red-600"
    >
      <div class="text-center">
        <p class="text-sm font-medium mb-4">
          {{
            typeof error === "string"
              ? error
              : "Erreur lors du chargement de l'activité"
          }}
        </p>
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Retour
        </button>
      </div>
    </div>

    <!-- Détail de l'activité -->
    <div v-else-if="activity" class="flex-1 pb-20">
      <!-- Image de la carte avec navigation en overlay -->
      <div class="relative w-full">
        <!-- Barre de navigation en position absolue -->
        <div class="absolute top-4 left-0 right-0 z-10">
          <ActivityDetailNav :on-back="goBack" :on-delete="deleteActivity" />
        </div>

        <!-- Image de la carte -->
        <div v-if="mapImageUrl" class="w-full">
          <img
            :src="mapImageUrl"
            :alt="`Carte de l'activité ${activity.activityType}`"
            class="w-full h-96 object-cover"
          />
        </div>
        <div
          v-else
          class="w-full h-96 bg-gray-200 flex items-center justify-center"
        >
          <p class="text-gray-500">Carte non disponible</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
