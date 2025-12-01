<script setup>
import { ref, watch, computed, onUnmounted, onMounted } from "vue";
import { useRouter } from "vue-router";
import { WSClient } from "wsmini";
import TheNavBar from "../components/TheNavBar.vue";

const router = useRouter();
const distance = ref(null);
const time = ref(null);
const ws = ref(null);
const isTracking = ref(false);
const isPaused = ref(false);
const elapsedSeconds = ref(0);
let gpsInterval = null;
let clockInterval = null;

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600);
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60);
  const seconds = elapsedSeconds.value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
});

const pushCoords = (start = false, stop = false) => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          start,
          stop,
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
        };
        if (ws.value) {
          ws.value.pub("gps", coords);
        }
        resolve();
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        resolve();
      }
    );
  });
};

const toggleTracking = async () => {
  if (!isTracking.value) {
    const token = localStorage.getItem("token");
    ws.value = new WSClient("ws://localhost:8888");
    await ws.value.connect(token);
    await ws.value.sub("gps", () => {});
    await pushCoords(true);

    isTracking.value = true;
    isPaused.value = false;
  } else {
    await pushCoords(false, true);

    setTimeout(() => {
      isTracking.value = false;
      isPaused.value = false;
      elapsedSeconds.value = 0;
      distance.value = null;
      time.value = null;
      if (ws.value) {
        ws.value.close();
      }
    }, 100);
  }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
};

watch(isTracking, () => {
  if (isTracking.value) {
    gpsInterval = setInterval(() => {
      if (!isPaused.value) {
        pushCoords();
      }
    }, 5000);

    clockInterval = setInterval(() => {
      if (!isPaused.value) {
        elapsedSeconds.value++;
      }
    }, 1000);
  } else {
    clearInterval(gpsInterval);
    clearInterval(clockInterval);
  }
});

onUnmounted(() => {
  if (gpsInterval) clearInterval(gpsInterval);
  if (clockInterval) clearInterval(clockInterval);
  if (ws.value) ws.value.close();
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
          <span class="text-3xl font-semibold"
            >{{ distance ? distance : " - " }} km</span
          >
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
  <TheNavBar/>
</template>

<style scoped></style>
