<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navItems = [
  { label: 'Accueil', path: '/home', icon: 'home' },
  { label: 'Enregistrer', path: '/tracking', icon: 'tracking' },
  { label: 'Historique', path: '/history', icon: 'history' },
  { label: 'Profil', path: '/profile', icon: 'profile' }
];

const isActive = (path) => route.path === path;

const navigate = (path) => {
  router.push(path);
};

const getStrokeColor = (path) => {
  return isActive(path) ? 'var(--orange)' : 'var(--noir)';
};

</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 w-screen bg-[var(--base)] px-4 py-3 shadow-lg">
    <div class="flex justify-around items-center w-full">
      <!-- Accueil -->
      <button @click="navigate('/home')" class="flex flex-col justify-center items-center hover:opacity-80 transition-opacity cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" :stroke="getStrokeColor('/home')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 10C2.99993 9.70907 3.06333 9.42163 3.18579 9.15772C3.30824 8.89382 3.4868 8.6598 3.709 8.47201L10.709 2.47201C11.07 2.16692 11.5274 1.99953 12 1.99953C12.4726 1.99953 12.93 2.16692 13.291 2.47201L20.291 8.47201C20.5132 8.6598 20.6918 8.89382 20.8142 9.15772C20.9367 9.42163 21.0001 9.70907 21 10V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V10Z" :stroke="getStrokeColor('/home')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div :style="{ color: isActive('/home') ? 'var(--orange)' : 'var(--noir)' }" class="text-center text-xs font-semibold font-inter mt-1">Accueil</div>
      </button>
      <!-- Enregistrer -->
      <button @click="navigate('/tracking')" class="flex flex-col justify-center items-center hover:opacity-80 transition-opacity cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" :stroke="getStrokeColor('/tracking')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" :fill="getStrokeColor('/tracking')"/>
          </svg>
          <div :style="{ color: isActive('/tracking') ? 'var(--orange)' : 'var(--noir)' }" class="text-center text-xs font-semibold font-inter mt-1">Enregistrer</div>
      </button>
      <!-- Historique -->
      <button @click="navigate('/history')" class="flex flex-col justify-center items-center hover:opacity-80 transition-opacity cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M6 14L7.5 11.1C7.66307 10.7761 7.91112 10.5027 8.21761 10.309C8.5241 10.1152 8.8775 10.0084 9.24 10H20M20 10C20.3055 9.99947 20.6071 10.0689 20.8816 10.2031C21.1561 10.3372 21.3963 10.5325 21.5836 10.7739C21.7709 11.0153 21.9004 11.2963 21.9622 11.5956C22.024 11.8948 22.0164 12.2042 21.94 12.5L20.4 18.5C20.2886 18.9316 20.0362 19.3135 19.6829 19.5853C19.3296 19.8571 18.8957 20.003 18.45 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21072 3.46957 3 4 3H7.9C8.23449 2.99673 8.56445 3.07739 8.8597 3.23462C9.15495 3.39186 9.40604 3.62063 9.59 3.9L10.4 5.1C10.5821 5.37653 10.83 5.60353 11.1215 5.76061C11.413 5.91769 11.7389 5.99995 12.07 6H18C18.5304 6 19.0391 6.21072 19.4142 6.58579C19.7893 6.96086 20 7.46957 20 8V10Z" :stroke="getStrokeColor('/history')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div :style="{ color: isActive('/history') ? 'var(--orange)' : 'var(--noir)' }" class="text-center text-xs font-semibold font-inter mt-1">Historique</div>
      </button>
      <!-- Profil -->
      <button @click="navigate('/profile')" class="flex flex-col justify-center items-center hover:opacity-80 transition-opacity cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" :stroke="getStrokeColor('/profile')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" :stroke="getStrokeColor('/profile')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div :style="{ color: isActive('/profile') ? 'var(--orange)' : 'var(--noir)' }" class="text-center text-xs font-semibold font-inter mt-1">Profil</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>