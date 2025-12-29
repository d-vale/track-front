<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Navigation, NavigationOff } from "lucide-vue-next";

const mapInstance = ref(null);
const geolocateControlRef = ref(null);
const currentPosition = ref(null);
const geolocateState = ref("ACTIVE_LOCK"); // "OFF", "BACKGROUND", "ACTIVE_LOCK"

onMounted(() => {
  initializeMap();
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
  }
});

const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoiay1zZWwiLCJhIjoiY21qcXlycDJ3M3hlcjNlcXhyMThlZWZydCJ9.uDpE5Dw1is7vJOmVzVXHGQ";

  mapInstance.value = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/standard", // style URL
    center: [7.4474, 46.948], // Berne, Suisse [longitude, latitude]
    zoom: 6.5, // zoom par défaut
    attributionControl: false,
    config: {
      basemap: {
        lightPreset: "night",
      },
    },
  });

  const map = mapInstance.value;

  // Ajouter le contrôle de géolocalisation
  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  });

  geolocateControlRef.value = geolocateControl;

  map.addControl(geolocateControl, "bottom-right");

  // Gérer les événements de géolocalisation
  geolocateControl.on("geolocate", (position) => {
    const coords = [position.coords.longitude, position.coords.latitude];
    currentPosition.value = coords;

    // Si on obtient une position, on est soit en ACTIVE_LOCK soit en BACKGROUND
    // On vérifie si on est en train de suivre activement
    if (geolocateControl._watchState === "ACTIVE_LOCK") {
      geolocateState.value = "ACTIVE_LOCK";
    } else if (geolocateControl._watchState === "BACKGROUND") {
      geolocateState.value = "BACKGROUND";
    }
  });

  geolocateControl.on("error", (error) => {
    console.error("Erreur de géolocalisation:", error);
    geolocateState.value = "OFF";
  });

  // Quand l'utilisateur déplace la carte manuellement
  geolocateControl.on("trackuserlocationstart", () => {
    geolocateState.value = "ACTIVE_LOCK";
  });

  geolocateControl.on("trackuserlocationend", () => {
    if (geolocateControl._watchState === "BACKGROUND") {
      geolocateState.value = "BACKGROUND";
    } else {
      geolocateState.value = "OFF";
    }
  });

  // Quand on passe en mode background (user a bougé la carte)
  map.on("movestart", (e) => {
    if (
      geolocateControl._watchState === "ACTIVE_LOCK" &&
      !e.originalEvent?.type?.includes("touch")
    ) {
      // Si le mouvement n'est pas causé par la géolocalisation elle-même
      setTimeout(() => {
        if (geolocateControl._watchState === "BACKGROUND") {
          geolocateState.value = "BACKGROUND";
        }
      }, 100);
    }
  });

  // Activer automatiquement la géolocalisation dès que la carte est chargée
  map.on("load", () => {
    geolocateControl.trigger();
  });
};

// Fonction pour obtenir la position actuelle
const getCurrentPosition = () => {
  return currentPosition.value;
};

// Fonction pour déclencher la géolocalisation
const triggerGeolocate = () => {
  if (geolocateControlRef.value) {
    geolocateControlRef.value.trigger();
  }
};

defineExpose({
  getCurrentPosition,
  triggerGeolocate,
});
</script>

<template>
  <div id="map"></div>
  <button @click="triggerGeolocate" class="custom-geolocate-btn">
    <!-- Active tracking: flèche pleine -->
    <Navigation
      v-if="geolocateState === 'ACTIVE_LOCK'"
      :size="20"
      :strokeWidth="2.5"
      fill="white"
    />
    <!-- Background: flèche vide -->
    <Navigation
      v-else-if="geolocateState === 'BACKGROUND'"
      :size="20"
      :strokeWidth="2.5"
    />
    <!-- Off: flèche barrée -->
    <NavigationOff v-else :size="20" :strokeWidth="2.5" />
  </button>
</template>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

/* Cacher le bouton Mapbox natif */
:deep(.mapboxgl-ctrl-geolocate) {
  display: none !important;
}

/* Bouton personnalisé avec glassmorphism */
.custom-geolocate-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  z-index: 1000;
}

.custom-geolocate-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.05);
}

.custom-geolocate-btn:active {
  transform: scale(0.98);
}
</style>
