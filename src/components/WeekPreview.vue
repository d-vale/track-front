<script setup>
import { ref, computed } from 'vue'

// Jours de la semaine
const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// État des jours (à adapter selon vos besoins)
const daysStatus = ['Pas d\'activité', 'Pas d\'activité', 'Activité', 'ajd', 'à venir', 'à venir', 'à venir']

// Calculer la date de lundi de la semaine en cours
const getCurrentWeekMonday = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(today.setDate(diff))
}

// Générer les dates de la semaine
const getWeekDates = () => {
  const monday = getCurrentWeekMonday()
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(date.getDate() + i)
    dates.push(date.getDate())
  }
  return dates
}

const weekDates = ref(getWeekDates())

// Fonction pour retourner les classes en fonction du statut
const getDayClasses = (status) => {
  switch (status) {
    case 'Activité':
      return 'w-7 h-7 p-0.5 bg-(--orange) rounded-3xl flex flex-col justify-between items-center overflow-hidden'
    case 'ajd':
      return 'w-7 h-7 p-0.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-noir flex flex-col justify-between items-center overflow-hidden'
    case 'à venir':
      return 'w-7 h-7 p-0.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-contour-jour-calendrier flex flex-col justify-between items-center overflow-hidden'
    default: // Pas d'activité
      return 'w-7 h-7 p-0.5 bg-gris-clair rounded-3xl flex flex-col justify-between items-center overflow-hidden'
  }
}

// Fonction pour retourner le contenu du jour
const getDayContent = (status) => {
  if (status === 'Activité') {
    return 'bg-base'
  }
  return 'text-center justify-center text-xs font-semibold leading-4'
}
</script>

<template>
<div class="w-full inline-flex justify-between items-center px-6">
    <div v-for="(day, index) in daysOfWeek" :key="index" :data-property-1="daysStatus[index]" class="w-10 p-2.5 rounded-[100px] inline-flex flex-col justify-center items-center gap-4">
        <div class="h-9 flex flex-col justify-start items-start gap-[3px]">
            <div class="text-center justify-center text-xl font-semibold">{{ day }}</div>
        </div>
        <div :class="getDayClasses(daysStatus[index])">
          <div v-if="daysStatus[index] === 'Activité'" :class="getDayContent(daysStatus[index])"></div>
          <div v-else class="h-4" :class="getDayContent(daysStatus[index])">{{ weekDates[index] }}</div>
        </div>
    </div>
</div>
</template>

<style scoped>
</style>