<script setup>
import { ref, watch, computed, onUnmounted, onMounted } from "vue";
import { useRouter } from "vue-router";
import TheNavBar from "../components/TheNavBar.vue";
import { geolocationService } from "../services/geolocationService.js";
import { onDeviceStorageService } from "../services/onDeviceStorageService.js";
import { haversine } from "../utils/haversine.mjs";
import { calcPace } from "../utils/paceCalculator.js";
import { v4 } from "uuid";
import { activityBuilderService } from "../services/activityBuilderService.js";

const router = useRouter();
const timeout = ref(null);
const ACTIVTIY_ID = ref(null);

const isTracking = ref(false);
const isPaused = ref(false);
const time = ref(null);
const elapsedSeconds = ref(0);
const started_at = ref(0);
const stopped_at = ref(0);

const distance = ref(0);
const lastPoint = ref(null);
const currentPoint = ref(null);

const lapDistance = ref(0);
const lapNumber = ref(1);
const lapElevationGain = ref(0);
const lapElevationLoss = ref(0);
const lapStartTimestamp = ref(null);

const currentHeight = ref(null);
const lastHeight = ref(null);
const elevationGain = ref(0);
const elevationLoss = ref(0);

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600);
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60);
  const seconds = elapsedSeconds.value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
});

const formattedDistance = computed(() => {
  return (distance.value / 1000).toFixed(2);
});

const updateDistance = () => {
  if (lastPoint.value) {
    let d = haversine(lastPoint.value, currentPoint.value);
    d < 12.5 ? (distance.value += d) : distance.value; // vitesse max humaine running 12.42m/s (2009)

    lapDistance.value += d;

    if (lapDistance.value >= 1000) {
      saveLap();
    }
  }
};

const saveLap = () => {
  let started_at = lapStartTimestamp.value;
  let finished_at = Date.now();
  let time = finished_at - started_at;
  let pace = calcPace(time, lapDistance.value);

  let lap = {
    lap: lapNumber.value,
    distance: lapDistance.value,
    elevationGain: lapElevationGain.value,
    elevationLoss: lapElevationLoss.value,
    pace,
    started_at,
    finished_at,
  };

  lapDistance.value = 0;
  lapElevationGain.value = 0;
  lapElevationLoss.value = 0;
  lapNumber.value += 1;
  lapStartTimestamp.value = Date.now();
  stopped_at.value = finished_at;

  onDeviceStorageService.addLap(ACTIVTIY_ID.value, lap);
};

const updateElevationGainLoss = () => {
  console.log("Height : ", currentHeight.value);

  if (currentHeight.value != null && lastHeight.value != null) {
    let diff = currentHeight.value - lastHeight.value; // (-) = perte (+) = gain
    diff < 0
      ? (elevationLoss.value += Math.abs(diff))
      : (elevationGain.value += Math.abs(diff));
  }

  console.log("D+ : ", elevationGain.value);
  console.log("D- : ", elevationLoss.value);
};

const startTracking = async () => {
  currentPoint.value = await geolocationService.getPos();
  currentHeight.value = await onDeviceStorageService.addPoint(
    currentPoint.value,
    ACTIVTIY_ID.value
  ); // si connexion, addPoint() retourne la hauteur du point ajouté, sinon null
  updateDistance();
  updateElevationGainLoss();

  elapsedSeconds.value++;
  lastPoint.value = currentPoint.value;
  lastHeight.value = currentHeight.value;

  timeout.value = setTimeout(() => startTracking(), 1000);
};

const stopTracking = () => {
  clearTimeout(timeout.value);
};

const togglePause = () => {
  !isPaused.value ? stopTracking() : startTracking();
  isPaused.value = !isPaused.value;
};

const toggleTracking = async () => {
  if (!isTracking.value) {
    set();
    onDeviceStorageService.init(ACTIVTIY_ID.value, started_at.value);
    startTracking();
  } else {
    try {
      saveLap();
      onDeviceStorageService.finish(ACTIVTIY_ID.value, stopped_at.value);
      stopTracking();
      await send();
    } catch (error) {
      console.error(error.message);
    } finally {
      reset();
    }
  }
  isTracking.value = !isTracking.value;
};
const send = async () => {
  const activity = await activityBuilderService.create(
    ACTIVTIY_ID.value,
    elapsedSeconds.value
  );

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Not authenticated, please login");
  }

  console.log("Sended activtiy : ", activity);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activity),
  };

  if (navigator.onLine) {
    const res = await fetch("/api/activities", options);
    const data = await res.json();
    console.log(data);
    if (data.success) {
      localStorage.removeItem(ACTIVTIY_ID.value);
    }
  } else {
    localStorage.setItem(ACTIVTIY_ID.value, JSON.stringify({data : {...activity}, toSend:true}));
  }
};

const set = () => {
  started_at.value = Date.now();
  lapStartTimestamp.value = started_at.value;
  ACTIVTIY_ID.value = v4();
};

const reset = () => {
  ACTIVTIY_ID.value = null;
  elapsedSeconds.value = 0;
  distance.value = null;
  time.value = null;
  lapNumber.value = 0;
};

onUnmounted(() => {
  stopTracking();
});

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <header
      class="flex justify-between items-center px-8 py-4 border-b border-gray-600"
    >
      <h2 class="text-xl font-semibold">Track App</h2>
      <button @click="handleLogout()" class="text-sm">Logout</button>
    </header>

    <div class="flex flex-col items-center gap-8 flex-1 pt-8">
      <h1 class="text-5xl font-normal leading-tight">Tracking</h1>

      <div class="flex flex-col gap-4 w-full max-w-sm">
        <div class="flex flex-col gap-2 p-4 rounded-lg border border-gray-600">
          <span class="text-sm text-gray-400">Chronomètre</span>
          <span class="text-3xl font-semibold">{{ formattedTime }}</span>
        </div>

        <div class="flex flex-col gap-2 p-4 rounded-lg border border-gray-600">
          <span class="text-sm text-gray-400">Distance</span>
          <span class="text-3xl font-semibold">{{ formattedDistance }} km</span>
        </div>

        <div class="flex flex-col gap-2 p-4 rounded-lg border border-gray-600">
          <span class="text-sm text-gray-400">Temps</span>
          <span class="text-3xl font-semibold"
            >{{ time ? time : " - " }} min</span
          >
        </div>

        <div class="flex gap-2">
          <button
            v-if="isTracking"
            @click="togglePause()"
            class="flex-1 rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors"
            :class="
              isPaused
                ? 'bg-green-600 hover:border-green-400'
                : 'bg-yellow-600 hover:border-yellow-400'
            "
          >
            {{ isPaused ? "Reprendre" : "Pause" }}
          </button>
          <button
            @click="toggleTracking()"
            class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-[#1a1a1a] cursor-pointer transition-colors hover:border-[#646cff]"
            :class="{
              'flex-1 bg-red-600 hover:border-red-400': isTracking,
              'w-full': !isTracking,
            }"
          >
            {{ isTracking ? "Stop tracking" : "Start tracking" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <TheNavBar />
</template>

<style scoped></style>
