<template>
  <div id="app" class="w-screen h-screen grid grid-cols-[auto_1fr]">
    <Sidebar />
    <main
      class="bg-white overflow-hidden bg-cover bg-center transition-all duration-500"
      :style="{ backgroundImage: `url(${currentBg})` }"
    >
      <router-view />

      <!-- Bouton changer le fond -->
      <div v-if="showBgButtons" class="absolute bottom-4 right-4 flex gap-2">
        <button
          v-for="(img, index) in images"
          :key="index"
          @click="changeBg(img)"
          class="px-3 py-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition"
        >
          Fond {{ index + 1 }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { usePreferencesStore } from '@/stores/preferencesStore'

const images = [
  '../public/img2.webp',
  '../public/img1.webp',
  '../public/img3.jpg',
  '../public/img6.webp',
  '../public/img8.jpg',
  '../public/img11.webp',
  '../public/img5.webp',
  '../public/img10.jpg',
]

const preferences = usePreferencesStore()
preferences.loadPreferences()
const currentBg = ref(preferences.currentBg || images[0])

function changeBg(img) {
  currentBg.value = img
  preferences.setBackground(img)
}

// Boutons de fonds uniquement sur board
const route = useRoute()
const showBgButtons = computed(() => route.name === 'board')
</script>
