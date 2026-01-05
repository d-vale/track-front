<script setup>
import { ref, onMounted } from "vue";
import { users_count } from "../../websocket.mjs";
import { useFetchJson } from "../composables/useFetchJson";

const totalKilometers = ref(0);

const { data, error, execute } = useFetchJson({
  url: '/api/users/yearly',
  method: 'GET',
  immediate: false,
})

const fetchTotalKilometers = async () => {
  await execute();
  if (data.value?.success) {
    totalKilometers.value = data.value.data.totalKilometers || 0;
  }
}

onMounted(() => {
  fetchTotalKilometers();
});

// Fonction pour refaire le fetch (peut être appelée après création d'une activité)
const refreshTotalKilometers = async () => {
  await fetchTotalKilometers();
};

// Expose la fonction pour utilisation externe si nécessaire
defineExpose({ refreshTotalKilometers });
</script>

<template>
    <div class="w-full px-2.5 py-5 inline-flex flex-col justify-start items-start gap-2.5">
    <div class="py-2.5 flex justify-start items-center gap-2.5">
        <div class="text-center justify-center text-noir text-xl font-semibold leading-4">Communauté</div>
    </div>

    <div class="w-full px-2.5 inline-flex justify-between items-center">
    <div class="text-center justify-center text-sm font-medium leading-4">Coureurs connectés</div>
    <div class="text-center justify-center text-(--gris-fonce) text-xs font-medium leading-4"> {{ users_count }}</div>
    </div>


    <div class="w-full px-2.5 inline-flex justify-between items-center">
    <div class="text-center justify-center text-sm font-medium leading-4">Nombre de kilomètres parcourus </div>
    <div class="text-center justify-center text-(--gris-fonce) text-xs font-medium leading-4"> {{ totalKilometers.toFixed(2) }} km</div>
    </div>
</div>
</template>

<style scoped></style>
