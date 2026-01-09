<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import ActivityDetailNav from "@/components/ActivityDetailNav.vue";
import ToastNotification from "@/components/ToastNotification.vue";
import LapsTable from "@/components/LapsTable.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import ChoiceModal from "@/components/ChoiceModal.vue";
import { useFetchJson } from "../composables/useFetchJson.js";
import { getAuthHeaders } from "@/helpers/authHelper.js";
import { useToast } from "@/composables/useToast.js";
import { uploadAndAddMediaToActivity, getActivityMedias } from "@/helpers/mediaHelper.js";
import polyline from "@mapbox/polyline";

const route = useRoute();
const router = useRouter();
const { addToast } = useToast();

// ID de l'activité depuis les paramètres de l'URL
const activityId = route.params.id;

// État de l'activité
const activity = ref(null);
const loading = ref(true);
const activityMedias = ref([]); // Médias de l'activité

// État des modales
const showDeleteModal = ref(false);
const showPhotoModal = ref(false);

// Refs pour les inputs file
const fileInputRef = ref(null);
const cameraInputRef = ref(null);
const isUploading = ref(false);

// États pour la gestion des images et du carrousel
const showingPhotos = ref(false); // true = carrousel de photos, false = carte
const currentPhotoIndex = ref(0); // Index de la photo actuellement affichée
const touchStartX = ref(0); // Position de départ du swipe
const touchEndX = ref(0); // Position de fin du swipe

// Options pour le modal de photo
const photoChoices = [
  {
    label: "Importer une photo",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    label: "Prendre une photo",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
];

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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
    const url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${pathEncoded}/auto/${width}x${height}@2x?access_token=${TOKEN}&attribution=false&logo=false`;

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

// URLs des médias (photos) de l'activité
const mediaUrls = computed(() => {
  if (!activityMedias.value || !Array.isArray(activityMedias.value) || activityMedias.value.length === 0) {
    return [];
  }
  // Les médias retournés sont directement des URLs (strings)
  // Si c'est un objet, on essaie de récupérer mediaUrl ou url
  const urls = activityMedias.value.map(media => {
    if (typeof media === 'string') {
      return media;
    }
    return media.mediaUrl || media.url || media;
  });
  console.log('URLs des médias:', urls);
  return urls;
});

// Vérifier si l'activité a des photos
const hasPhotos = computed(() => mediaUrls.value.length > 0);

// URL de l'image actuellement affichée dans le carrousel
const currentPhotoUrl = computed(() => {
  if (mediaUrls.value.length === 0) return null;
  return mediaUrls.value[currentPhotoIndex.value];
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

// Charger les médias de l'activité
const loadActivityMedias = async () => {
  try {
    const response = await getActivityMedias(activityId);

    // L'API retourne { success: true, data: { medias: [...] } }
    let medias = [];
    if (response && response.data && Array.isArray(response.data.medias)) {
      medias = response.data.medias;
    } else if (Array.isArray(response)) {
      medias = response;
    } else if (response && Array.isArray(response.data)) {
      medias = response.data;
    } else if (response && response.medias && Array.isArray(response.medias)) {
      medias = response.medias;
    }

    console.log('Médias chargés:', medias);
    activityMedias.value = medias;
  } catch (error) {
    console.error('Erreur lors du chargement des médias:', error);
    activityMedias.value = [];
  }
};

// Charger l'activité
onMounted(async () => {
  loading.value = true;
  await execute();

  if (data.value) {
    // L'API retourne { success: true, data: {...} }
    activity.value = data.value.data || data.value;
  }
  console.log('Activité:', activity.value);

  // Charger les médias
  await loadActivityMedias();

  loading.value = false;
});

// Retour à la page précédente
const goBack = () => {
  router.back();
};

// Ouvrir le modal de suppression
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

// Ouvrir le modal de photo
const openPhotoModal = () => {
  showPhotoModal.value = true;
};

// Confirmer la suppression de l'activité
const confirmDelete = async () => {
  try {
    const response = await fetch(`/api/activities/${activityId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      router.push({ path: "/home", query: { deleted: "true" } });
    } else {
      addToast("Erreur lors de la suppression de l'activité", "error");
    }
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    addToast("Erreur lors de la suppression de l'activité", "error");
  }
};

// Gérer le choix de photo
const handlePhotoChoice = ({ choice, index }) => {
  if (index === 0) {
    // Importer une photo
    handleImportPhoto();
  } else if (index === 1) {
    // Prendre une photo
    handleTakePhoto();
  }
};

// Fonction pour importer une photo
const handleImportPhoto = () => {
  fileInputRef.value.click();
};

// Fonction pour prendre une photo
const handleTakePhoto = () => {
  cameraInputRef.value.click();
};

// Gérer la sélection d'un fichier (import)
const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    isUploading.value = true;
    await uploadAndAddMediaToActivity(file, activityId);
    addToast("Photo ajoutée avec succès", "success");
    // Recharger les médias pour afficher la nouvelle photo
    await loadActivityMedias();
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    addToast("Erreur lors de l'ajout de la photo", "error");
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
};

// Gérer la capture d'une photo (caméra)
const onCameraCapture = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    isUploading.value = true;
    await uploadAndAddMediaToActivity(file, activityId);
    addToast("Photo ajoutée avec succès", "success");
    // Recharger les médias pour afficher la nouvelle photo
    await loadActivityMedias();
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    addToast("Erreur lors de l'ajout de la photo", "error");
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
};

// Basculer entre la carte et le carrousel de photos
const toggleView = () => {
  showingPhotos.value = !showingPhotos.value;
  if (showingPhotos.value) {
    currentPhotoIndex.value = 0; // Réinitialiser à la première photo
  }
};

// Navigation dans le carrousel
const nextPhoto = () => {
  if (currentPhotoIndex.value < mediaUrls.value.length - 1) {
    currentPhotoIndex.value++;
  }
};

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
};

// Gestion du swipe pour mobile
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50; // Distance minimale pour considérer un swipe
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe vers la gauche -> photo suivante
      nextPhoto();
    } else {
      // Swipe vers la droite -> photo précédente
      previousPhoto();
    }
  }

  // Réinitialiser
  touchStartX.value = 0;
  touchEndX.value = 0;
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <ToastNotification />

    <!-- Inputs file invisibles -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileSelected"
    />
    <input
      ref="cameraInputRef"
      type="file"
      accept="image/*"
      capture
      class="hidden"
      @change="onCameraCapture"
    />

    <!-- Modales -->
    <ConfirmModal
      :is-open="showDeleteModal"
      title="Supprimer l'activité"
      message="Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible."
      confirm-text="Supprimer"
      cancel-text="Annuler"
      confirm-class="bg-red-500 hover:bg-red-600"
      @confirm="confirmDelete"
      @close="showDeleteModal = false"
    />

    <ChoiceModal
      :is-open="showPhotoModal"
      title="Ajouter une photo"
      :choices="photoChoices"
      @select="handlePhotoChoice"
      @close="showPhotoModal = false"
    />

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
          <ActivityDetailNav
            :on-back="goBack"
            :on-delete="openDeleteModal"
            :on-camera="openPhotoModal"
          />
        </div>

        <!-- Image principale : Carte ou Carrousel de photos -->
        <div class="relative w-full">
          <!-- Mode Carte -->
          <div v-if="!showingPhotos && mapImageUrl" class="w-full">
            <img
              :src="mapImageUrl"
              alt="Carte de l'activité"
              class="w-full h-96 object-cover"
            />
          </div>
          <div
            v-else-if="!showingPhotos && !mapImageUrl"
            class="w-full h-96 bg-gray-200 flex items-center justify-center"
          >
            <p class="text-gray-500">Carte non disponible</p>
          </div>

          <!-- Mode Carrousel de photos -->
          <div
            v-if="showingPhotos && hasPhotos"
            class="relative w-full h-96 bg-black"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <!-- Photo actuelle -->
            <img
              :src="currentPhotoUrl"
              :alt="`Photo ${currentPhotoIndex + 1}`"
              class="w-full h-full object-contain"
            />

            <!-- Boutons de navigation (desktop) -->
            <button
              v-if="currentPhotoIndex > 0"
              @click="previousPhoto"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 active:scale-95 md:block hidden z-20"
              aria-label="Photo précédente"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

            <button
              v-if="currentPhotoIndex < mediaUrls.length - 1"
              @click="nextPhoto"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 active:scale-95 md:block hidden z-20"
              aria-label="Photo suivante"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Indicateur de position -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium md:text-sm text-xs md:px-3 md:py-1 px-2 py-0.5 z-20">
              {{ currentPhotoIndex + 1 }} / {{ mediaUrls.length }}
            </div>
          </div>

          <!-- Miniature d'aperçu en bas à gauche (seulement si il y a des photos) -->
          <div
            v-if="hasPhotos"
            @click="toggleView"
            class="absolute bottom-4 left-4 w-20 h-20 rounded-lg overflow-hidden cursor-pointer select-none shadow-lg border-2 border-white hover:scale-105 hover:shadow-2xl transition-all duration-200 z-20"
          >
            <!-- Afficher la miniature de la première photo si on est en mode carte -->
            <img
              v-if="!showingPhotos"
              :src="mediaUrls[0]"
              alt="Aperçu photos"
              class="w-full h-full object-cover"
            />
            <!-- Afficher la miniature de la carte si on est en mode carrousel -->
            <img
              v-else-if="mapImageUrl"
              :src="mapImageUrl"
              alt="Aperçu carte"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Informations de l'activité -->
      <div class="w-full">
        <!-- Titre et date -->
        <div class="px-6 py-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-bold">Activité</h2>
            <div class="flex items-center gap-1">
              <svg
                width="15"
                height="13"
                viewBox="0 0 20 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 h-3"
              >
                <path
                  d="M14.3861 9.79083L12.3979 8.86065C11.843 8.60305 11.3762 8.20509 11.0506 7.71187C10.725 7.21864 10.5535 6.64989 10.5556 6.07009V4.15967C10.5556 4.02176 10.497 3.88949 10.3928 3.79196C10.2886 3.69444 10.1473 3.63965 10 3.63965C9.11622 3.63879 8.26891 3.30979 7.64399 2.72484C7.01907 2.13989 6.66758 1.34678 6.66666 0.519539C6.66657 0.422799 6.63765 0.328001 6.58315 0.245804C6.52865 0.163607 6.45073 0.0972689 6.35816 0.0542485C6.26559 0.0112282 6.16204 -0.00676897 6.05914 0.00228041C5.95624 0.0113298 5.85808 0.0470668 5.77569 0.105474L0.425694 3.89966L0.411805 3.91006C0.290796 4.00181 0.191741 4.11634 0.121065 4.24623C0.0503889 4.37611 0.00967073 4.51846 0.00155131 4.66402C-0.00656811 4.80959 0.0180926 4.95513 0.0739338 5.0912C0.129775 5.22727 0.21555 5.35083 0.325694 5.45387L8.22222 12.8479C8.27385 12.8962 8.33514 12.9345 8.40258 12.9605C8.47002 12.9866 8.5423 13.0001 8.61527 13H13.8889C14.1836 13 14.4662 12.8904 14.6746 12.6954C14.8829 12.5003 15 12.2358 15 11.96V10.721C15.0007 10.5278 14.9435 10.3382 14.835 10.1738C14.7265 10.0094 14.571 9.87677 14.3861 9.79083ZM13.8889 11.96H8.84513L1.11111 4.72064L2.00486 4.08622L4.69861 6.60766C4.80285 6.70541 4.94431 6.7604 5.09187 6.76052C5.23942 6.76064 5.38099 6.70589 5.48541 6.60831C5.58984 6.51074 5.64858 6.37833 5.64871 6.24021C5.64884 6.10209 5.59035 5.96959 5.48611 5.87184L2.89861 3.4518L5.67639 1.48157C5.88692 2.30488 6.36018 3.0487 7.03325 3.61416C7.70632 4.17962 8.54732 4.53993 9.44444 4.64719V6.07009C9.44168 6.84321 9.67041 7.60159 10.1047 8.25923C10.5389 8.91686 11.1614 9.44745 11.9014 9.79083L13.8889 10.721V11.96ZM3.25 10.9199H0.555555C0.408213 10.9199 0.266905 10.8651 0.162718 10.7676C0.0585315 10.6701 0 10.5378 0 10.3999C0 10.262 0.0585315 10.1297 0.162718 10.0322C0.266905 9.93467 0.408213 9.87988 0.555555 9.87988H3.25C3.39734 9.87988 3.53865 9.93467 3.64284 10.0322C3.74702 10.1297 3.80555 10.262 3.80555 10.3999C3.80555 10.5378 3.74702 10.6701 3.64284 10.7676C3.53865 10.8651 3.39734 10.9199 3.25 10.9199ZM6.02778 12.48C6.02778 12.6179 5.96924 12.7502 5.86506 12.8477C5.76087 12.9452 5.61956 13 5.47222 13H1.66667C1.51932 13 1.37802 12.9452 1.27383 12.8477C1.16964 12.7502 1.11111 12.6179 1.11111 12.48C1.11111 12.3421 1.16964 12.2098 1.27383 12.1123C1.37802 12.0147 1.51932 11.96 1.66667 11.96H5.47222C5.61956 11.96 5.76087 12.0147 5.86506 12.1123C5.96924 12.2098 6.02778 12.3421 6.02778 12.48Z"
                  fill="currentColor"
                />
              </svg>
              <span class="text-xs font-medium">
                {{ formatDateTime(activity.date) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="w-full">
          <!-- Ligne 1: Distance et Temps -->
          <div class="px-6 py-2 flex items-center gap-16">
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Distance</span>
              <span class="text-xl font-bold">
                {{ formatDistance(activity.distance) }} km
              </span>
            </div>
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Temps</span>
              <span class="text-xl font-bold">
                {{ formatDuration(activity.duration) }}
              </span>
            </div>
          </div>

          <!-- Ligne 2: Calories et Dénivelé -->
          <div class="px-6 py-2 flex items-center gap-16">
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Calories</span>
              <span class="text-xl font-bold">
                {{ Math.round(activity.estimatedCalories) }} kcal
              </span>
            </div>
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Dénivelé</span>
              <span class="text-xl font-bold">
                {{
                  (activity.elevationGain + activity.elevationLoss).toFixed(0)
                }}
                m
              </span>
            </div>
          </div>
          <!-- Ligne 3: Allure et Dénivelé -->
          <div class="px-6 py-2 flex items-center gap-16">
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Allure</span>
              <span class="text-xl font-bold">
                {{ activity.avgPace }} min/km
              </span>
            </div>
            <div class="flex flex-col gap-0.5 flex-1">
              <span class="text-[10px] font-medium">Ratio difficulté</span>
              <span class="text-xl font-bold">
                {{ activity.difficultyScore }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tableau des laps -->
        <div v-if="activity.laps && activity.laps.length > 0" class="px-6 py-6">
          <LapsTable :laps="activity.laps" />
        </div>
      </div>
    </div>
  </div>
</template>
