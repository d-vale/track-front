<script setup>
const props = defineProps({
  laps: {
    type: Array,
    required: true,
  },
});

// Formater l'allure (pace) en min/km
const formatPace = (lap) => {
  if (!lap.duration || !lap.distance || lap.distance === 0) return "--:--";

  // Durée en secondes / distance en km = secondes par km
  const secondsPerKm = (lap.duration / 1000) / (lap.distance / 1000);
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Calculer la largeur relative de la barre orange
const getBarWidth = (lap, allLaps) => {
  if (!lap.duration || allLaps.length === 0) return 50;

  const durations = allLaps.map((l) => l.duration || 0);
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);

  if (maxDuration === minDuration) return 100;

  // Calculer un pourcentage entre 40% et 100% pour avoir une visualisation significative
  const percentage =
    ((lap.duration - minDuration) / (maxDuration - minDuration)) * 60 + 40;
  return Math.round(percentage);
};
</script>

<template>
  <div class="w-full inline-flex flex-col justify-start items-start">
    <!-- En-tête du tableau -->
    <div
      class="self-stretch p-2.5 border-b border-separation inline-flex justify-between items-center"
    >
      <div class="pl-1.5 flex justify-start items-center gap-8">
        <div class="text-center justify-center text-[10px] font-medium leading-4">
          Km
        </div>
        <div class="text-center justify-center text-[10px] font-medium leading-4">
          Allure
        </div>
      </div>
      <div class="flex justify-end items-center gap-5">
        <div class="w-16 text-center justify-center text-[10px] font-medium leading-4">
          Rythme
        </div>
        <div class="w-9 text-center justify-center text-[10px] font-medium leading-4">
          D+
        </div>
        <div class="w-9 text-center justify-center text-[10px] font-medium leading-4">
          D-
        </div>
      </div>
    </div>

    <!-- Lignes du tableau -->
    <div
      v-for="(lap, index) in laps"
      :key="index"
      class="self-stretch p-2.5 inline-flex justify-between items-center border-b border-separation last:border-b-0"
      :class="{ 'pt-4': index === 0 }"
    >
      <!-- Kilomètre et Allure -->
      <div class="w-20 pl-2 flex justify-start items-center gap-10">
        <div class="text-center justify-center text-xs font-semibold leading-4">
          {{ index + 1 }}
        </div>
        <div class="text-center justify-center text-xs font-semibold leading-4">
          {{ formatPace(lap) }}
        </div>
      </div>

      <!-- Barre de visualisation et statistiques -->
      <div class="flex justify-end items-center gap-2">
        <!-- Barre de visualisation -->
        <div class="w-16 rounded-[5px] inline-flex flex-col justify-center items-start">
          <div
            class="h-5 bg-[#FF8C00] rounded"
            :style="{ width: `${getBarWidth(lap, laps)}%` }"
          ></div>
        </div>

        <!-- D+ -->
        <div class="w-9 text-center justify-center text-xs font-semibold leading-4">
          {{ Math.round(lap.elevationGain || 0) }}
        </div>

        <!-- D- -->
        <div class="w-9 text-center justify-center text-xs font-semibold leading-4">
          {{ Math.round(lap.elevationLoss || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
