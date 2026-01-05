<script setup>
import { onMounted, ref } from "vue";
import { useFetchJson } from "../composables/useFetchJson";
import { Pencil } from "lucide-vue-next";
import { Settings } from "lucide-vue-next";
import WeeklyChart from "../components/WeeklyChart.vue";

const user = ref(null);
const selectedWeek = ref(null);
const selectedWeekIndex = ref(null);
const selectedWeekLabel = ref("Cette semaine");

const weeksData = ref([
  // Octobre
  { week: 1, month: "Oct", distance: 30, duration: "2h 15m", elevation: 120, startDate: "2024-10-01", endDate: "2024-10-07" },
  { week: 2, month: "Oct", distance: 22, duration: "1h 45m", elevation: 85, startDate: "2024-10-08", endDate: "2024-10-14" },
  { week: 3, month: "Oct", distance: 25, duration: "2h 00m", elevation: 95, startDate: "2024-10-15", endDate: "2024-10-21" },
  { week: 4, month: "Oct", distance: 32, duration: "2h 30m", elevation: 140, startDate: "2024-10-22", endDate: "2024-10-28" },
  // Novembre
  { week: 1, month: "Nov", distance: 18, duration: "1h 30m", elevation: 70, startDate: "2024-11-01", endDate: "2024-11-07" },
  { week: 2, month: "Nov", distance: 21, duration: "1h 50m", elevation: 80, startDate: "2024-11-08", endDate: "2024-11-14" },
  { week: 3, month: "Nov", distance: 27, duration: "2h 10m", elevation: 105, startDate: "2024-11-15", endDate: "2024-11-21" },
  { week: 4, month: "Nov", distance: 25, duration: "2h 05m", elevation: 100, startDate: "2024-11-22", endDate: "2024-11-28" },
  // Décembre
  { week: 1, month: "Déc", distance: 25, duration: "2h 00m", elevation: 95, startDate: "2024-12-01", endDate: "2024-12-07" },
  { week: 2, month: "Déc", distance: 23, duration: "1h 55m", elevation: 90, startDate: "2024-12-08", endDate: "2024-12-14" },
  { week: 3, month: "Déc", distance: 21, duration: "1h 48m", elevation: 82, startDate: "2024-12-15", endDate: "2024-12-21" },
  { week: 4, month: "Déc", distance: 20, duration: "1h 40m", elevation: 75, startDate: "2024-12-22", endDate: "2024-12-28" },
  // Janvier (semaine actuelle pour test)
  { week: 1, month: "Jan", distance: 43.1, duration: "3h 21m", elevation: 55, startDate: "2026-01-01", endDate: "2026-01-08" },
]);

const fetchUser = async () => {
  const { data, error, execute } = useFetchJson({
    url: "/api/users/user",
    method: "GET",
    immediate: false,
  });

  await execute();

  if (!error.value) {
    user.value = data.value.data;

    // Ajouter des médias placeholder si aucun média n'existe
    if (!user.value.medias || user.value.medias.length === 0) {
      user.value.medias = [
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+1" },
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+2" },
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+3" },
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+4" },
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+5" },
        { url: "https://placehold.co/300x300/e2e8f0/64748b?text=Photo+6" },
      ];
    }

    console.log(user.value);
  } else {
    console.error("Error fetching user:", error.value);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <main class="flex flex-col m-4 gap-8">
    <div class="flex flex-row items-center gap-4">
      <div class="w-24 h-24 rounded-full overflow-hidden">
        <img
          src="https://placehold.co/200x200"
          alt="Photo de profil"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="text-start">
        <h1 class="text-xl font-semibold">
          {{ user?.firstname }} {{ user?.lastname }}
        </h1>
        <p class="text-gray-600">Vevey, Switzerland</p>
      </div>

      <div class="flex flex-row gap-4 ml-auto">
        <div
          class="cursor-pointer p-2 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Pencil :size="20" />
        </div>

        <div
          class="cursor-pointer p-2 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Settings :size="20" />
        </div>
      </div>
    </div>

    <div>
      <p class="text-2xl font-semibold mb-4">Galerie</p>
      <div
        v-if="user?.medias && user.medias.length > 0"
        class="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style="scrollbar-width: none"
      >
        <div
          v-for="(media, index) in user.medias"
          :key="index"
          class="shrink-0 aspect-square overflow-hidden rounded-lg snap-start"
          style="width: calc((100% - 1.5rem) / 2.5)"
        >
          <img
            :src="media.url"
            :alt="`Media ${index + 1}`"
            class="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
          />
        </div>
      </div>
      <p v-else class="text-gray-600">Aucune photo disponible.</p>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-2xl font-semibold">
        {{ selectedWeekLabel }}
      </p>
      <div class="flex gap-8 mb-4">
        <div>
          <p class="text-gray-600">Distance</p>
          <p class="text-xl font-semibold">
            {{ selectedWeek ? selectedWeek.distance : "43.1" }} km
          </p>
        </div>
        <div>
          <p class="text-gray-600">Durée</p>
          <p class="text-xl font-semibold">
            {{ selectedWeek ? selectedWeek.duration : "3h 21m" }}
          </p>
        </div>
        <div>
          <p class="text-gray-600">Élévation</p>
          <p class="text-xl font-semibold">
            {{ selectedWeek ? selectedWeek.elevation : "55" }} m
          </p>
        </div>
      </div>

      <WeeklyChart
        :data="weeksData"
        :selected-index="selectedWeekIndex"
        @select="
          (index) => {
            selectedWeekIndex = index;
            selectedWeek = weeksData[index];
          }
        "
        @week-label="
          (label) => {
            selectedWeekLabel = label;
          }
        "
      />
    </div>
  </main>
</template>

<style scoped></style>
