<script setup>
import TheNavBar from "@/components/TheNavBar.vue";
import ActivityPreview from "@/components/ActivityPreview.vue";
import TheHeader from "@/components/TheHeader.vue";
import WeekPreview from "../components/WeekPreview.vue";
import CommunityWidget from "../components/CommunityWidget.vue";
</script>

<template>
  <TheHeader />
  <WeekPreview/>
  <CommunityWidget/>
  <ActivityPreview/>
  <TheNavBar />
</template>

<style scoped></style>
