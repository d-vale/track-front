<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Sun, Moon } from 'lucide-vue-next';
import { users_count, ws } from "../../websocket.mjs";

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
  <header class="flex justify-between items-center px-8 py-4 border-b border-gray-600">
    <h2 class="text-xl italic font-normal">Tracks</h2>

    <div class="flex items-center gap-3">
      <div>
        <p>connected users : {{ users_count }}</p>
      </div>
      <button @click="toggleTheme()" class="p-2 rounded-lg">
        <Sun v-if="theme === 'light'" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <button @click="handleLogout()" class="text-sm px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
        Logout
      </button>
    </div>

  </header>
</template>

<style scoped></style>
