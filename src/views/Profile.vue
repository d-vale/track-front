<script setup>
import { onMounted, ref } from "vue";
import { useFetchJson } from "../composables/useFetchJson";
import { Pencil } from "lucide-vue-next";
import { Settings } from "lucide-vue-next";
import WeeklyChart from "../components/WeeklyChart.vue";
import TheNavBar from "@/components/TheNavBar.vue";

const user = ref(null);
const selectedWeek = ref(null);
const selectedWeekIndex = ref(null);
const selectedWeekLabel = ref("Cette semaine");

const weeksData = ref([]);

const getMonthLabel = (monthNumber) => {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return months[monthNumber - 1];
};

const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const generateLast12Weeks = () => {
  const weeks = [];
  const today = new Date();

  // Générer les 12 dernières semaines INCLUANT la semaine actuelle
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(today);
    // Calculer le lundi de la semaine (i semaines en arrière)
    const daysToMonday = today.getDay() === 0 ? 6 : today.getDay() - 1; // Si dimanche (0), reculer de 6 jours, sinon reculer jusqu'au lundi
    weekStart.setDate(today.getDate() - daysToMonday - (i * 7));

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Dimanche de la semaine

    const monthNumber = weekStart.getMonth() + 1;
    const year = weekStart.getFullYear();
    const weekNumber = getWeekNumber(weekStart);

    weeks.push({
      week: weekNumber,
      year: year,
      month: getMonthLabel(monthNumber),
      distance: 0,
      duration: formatDuration(0),
      elevation: 0,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0]
    });
  }

  return weeks;
};

const fetchWeeklyData = async () => {
  // Initialiser avec 12 semaines à 0
  weeksData.value = generateLast12Weeks();

  const { data, error, execute } = useFetchJson({
    url: "/api/users/weekly",
    method: "GET",
    immediate: false,
  });

  await execute();
  if (!error.value && data.value && data.value.data) {
    console.log("Weekly data fetched successfully : ", data.value);

    // Remplir les données de l'API dans les semaines correspondantes
    data.value.data.forEach(item => {
      // Trouver l'index de la semaine correspondante dans weeksData en comparant year et week
      const weekIndex = weeksData.value.findIndex(w =>
        w.year === item.year && w.week === item.week
      );

      if (weekIndex !== -1) {
        // S'assurer que toutes les valeurs sont des nombres valides
        const totalKm = Number(item.totalKm) || 0;
        const totalTime = Number(item.totalTime) || 0;
        const totalElevation = Number(item.totalElevation) || 0;

        weeksData.value[weekIndex] = {
          ...weeksData.value[weekIndex],
          distance: Math.round(totalKm * 10) / 10,
          duration: formatDuration(totalTime),
          elevation: Math.round(totalElevation)
        };
      }
    });

  } else {
    console.error("Error fetching weekly data:", error.value);
  }
};

onMounted(() => {
  fetchWeeklyData();
});

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
  <div class="flex flex-col h-screen">
    <main class="flex flex-col m-4 gap-8 flex-1 overflow-y-auto">
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
          <p>Vevey, Switzerland</p>
        </div>

        <div class="flex flex-row gap-4 ml-auto">
          <div
            class="icon-button"
          >
            <Pencil :size="20" />
          </div>

          <div
            class="icon-button"
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
        <p class="base(--secondary)">Aucune photo disponible.</p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-2xl font-semibold">
          {{ selectedWeekLabel }}
        </p>
        <div class="flex gap-8 mb-4">
          <div>
            <p class="base(--secondary)">Distance</p>
            <p class="text-xl font-semibold">
              {{ selectedWeek ? selectedWeek.distance : "0" }} km
            </p>
          </div>
          <div>
            <p class="base(--secondary)">Durée</p>
            <p class="text-xl font-semibold">
              {{ selectedWeek ? selectedWeek.duration : "0h 0m" }}
            </p>
          </div>
          <div>
            <p class="base(--secondary)">Élévation</p>
            <p class="text-xl font-semibold">
              {{ selectedWeek ? selectedWeek.elevation : "0" }} m
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
    <TheNavBar />
  </div>
</template>

<style scoped>

</style>
