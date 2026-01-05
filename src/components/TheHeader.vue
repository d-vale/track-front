<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Sun, Moon, Settings } from 'lucide-vue-next';

const router = useRouter();
const theme = ref(document.querySelector("body").classList.contains("dark") ? "dark" : "light");

const toggleTheme = () => {
  document.querySelector("body").classList.toggle("dark");
  theme.value = document.querySelector("body").classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
};

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
  ws.close();
};
</script>

<template>
  <header class="flex justify-between items-center px-2.5 py-4">
    <div class="flex items-center gap-3">
      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 14.5H29V4.17233e-07L14.5 14.5Z" fill="var(--noir)"/>
<path d="M14.5 29H29V14.5L14.5 29Z" fill="var(--noir)"/>
<path d="M0 29H14.5V14.5L0 29Z" fill="var(--noir)"/>
<path d="M0 14.5H14.5V4.17233e-07L0 14.5Z" fill="var(--noir)"/>
</svg>
      <h2 class="text-xl font-normal">Tracks</h2>
    </div>

    <div class="flex items-center gap-3">
      <button @click="toggleTheme()" class="p-2 rounded-lg">
        <Sun v-if="theme === 'light'" :size="20" />
        <Moon v-else :size="20" />
      </button>
      <button @click="" class="p-2 rounded-lg">
        <Settings size="20"/>
      </button>

      <button @click="handleLogout()" class="text-sm px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped></style>
