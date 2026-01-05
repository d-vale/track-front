<script setup>
import { ref } from 'vue';
import TheNavBar from "@/components/TheNavBar.vue";
import TheHeader from "@/components/TheHeader.vue";

const photo = ref(null);
const videoStream = ref(null);
const showCamera = ref(false);

const takePhoto = async () => {
  showCamera.value = true;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    videoStream.value = stream;

    // Attendre que la vidéo soit prête
    setTimeout(() => {
      const video = document.getElementById('camera-video');
      if (video) {
        video.srcObject = stream;
      }
    }, 100);
  } catch (error) {
    console.error('Erreur lors de l\'accès à la caméra:', error);
    showCamera.value = false;
  }
};

const capturePhoto = () => {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');

  if (video && canvas) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    photo.value = canvas.toDataURL('image/png');
    stopCamera();
  }
};

const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop());
    videoStream.value = null;
  }
  showCamera.value = false;
};
</script>

<template>
  <div class="flex flex-col h-screen">
    <TheHeader class="shrink-0" />

    <main class="flex-1 overflow-y-auto">
      <div class="profile-container">
        <div class="photo-section">
          <div v-if="photo && !showCamera" class="photo-preview">
            <img :src="photo" alt="Photo de profil" />
          </div>

          <div v-if="showCamera" class="camera-container">
            <video id="camera-video" autoplay playsinline></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div class="camera-controls">
              <button @click="capturePhoto" class="capture-button">
                📸 Capturer
              </button>
              <button @click="stopCamera" class="cancel-button">
                ❌ Annuler
              </button>
            </div>
          </div>

          <button v-if="!showCamera" @click="takePhoto" class="photo-button">
            📷 Prendre une photo
          </button>
        </div>
      </div>
    </main>

    <TheNavBar class="shrink-0" />
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.photo-preview {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.photo-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.camera-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.camera-container video {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.camera-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.photo-button,
.capture-button,
.cancel-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo-button {
  background-color: #007bff;
  color: white;
}

.photo-button:hover {
  background-color: #0056b3;
}

.capture-button {
  background-color: #28a745;
  color: white;
}

.capture-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.photo-button:active,
.capture-button:active,
.cancel-button:active {
  transform: scale(0.98);
}
</style>
