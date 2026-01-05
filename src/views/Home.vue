<script setup>
import TheNavBar from "@/components/TheNavBar.vue";
import ActivityPreview from "@/components/ActivityPreview.vue";
import TheHeader from "@/components/TheHeader.vue";
import WeekPreview from "../components/WeekPreview.vue";
import { onMounted, ref } from "vue";
import { useFetchJson } from "../composables/useFetchJson";
import CommunityWidget from "../components/CommunityWidget.vue";

const activities = ref([]);

const fetchActivities = async () => {
  const { data, error, execute } = useFetchJson({
    url: "/api/activities",
    method: "GET",
    immediate: false,
  });

  await execute();

  if (!error.value) {
    activities.value = data.value.data;
    console.log(activities.value);
  } else {
    console.error("Error fetching activities:", error.value);
  }
};

onMounted(() => {
  fetchActivities();
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <TheHeader class="shrink-0" />
    <main class="flex-1 overflow-y-auto">
      <WeekPreview :activities="activities" />
      <CommunityWidget />
      <ActivityPreview :activities="activities" />
    </main>
    <TheNavBar class="shrink-0" />
  </div>
</template>

<style scoped></style>
