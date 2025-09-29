<template>
  <div class="min-h-screen h-64 overflow-auto bg-gradient-to-br from-indigo-200 via-white to-purple-300 p-8">
    <header class="mb-12 text-center">
      <h1 class="text-5xl font-extrabold text-gray-800">
        👋 Bienvenue, <span class="text-indigo-800">{{ user?.name || 'Utilisateur' }}</span>
      </h1>
      <p class="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
        Organisez vos idées, collaborez avec votre équipe et transformez vos projets en succès
      </p>
    </header>

    <section class="grid md:grid-cols-3 gap-8">
      <div
        v-for="(feature, i) in features"
        :key="i"
        class="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition transform"
      >
        <div
          class="w-16 h-16 flex items-center justify-center rounded-full text-3xl mb-4"
          :class="feature.bg"
        >
          {{ feature.icon }}
        </div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ feature.title }}</h2>
        <p class="text-gray-600 text-sm">{{ feature.desc }}</p>
      </div>
    </section>

    <section
      class="mt-16 bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg rounded-3xl p-10"
    >
      <h2 class="text-3xl font-bold mb-6">🚀 Comment démarrer ?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="(step, i) in steps" :key="i" class="flex items-start space-x-3">
          <div
            class="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold"
          >
            {{ i + 1 }}
          </div>
          <p class="text-base">{{ step }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth-store'

const auth = useAuthStore()
const user = auth.user

const features = [
  {
    icon: '📂',
    title: 'Ajouter une catégorie',
    desc: 'Classez vos projets en espaces distincts.',
    bg: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: '📝',
    title: 'Créer des posts',
    desc: 'Ajoutez des tâches ou idées dans vos catégories.',
    bg: 'bg-pink-100 text-pink-600',
  },
  {
    icon: '🔍',
    title: 'Voir les détails',
    desc: 'Consultez toutes les infos sur vos cartes.',
    bg: 'bg-green-100 text-green-600',
  },
  {
    icon: '💬',
    title: 'Laisser des commentaires',
    desc: 'Discutez et collaborez en équipe.',
    bg: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: '🎨',
    title: 'Personnaliser vos cartes',
    desc: 'Choisissez des couleurs pour vos cartes.',
    bg: 'bg-purple-100 text-purple-600',
  },
  {
    icon: '✏️',
    title: 'Modifier à tout moment',
    desc: 'Changez vos titres et descriptions facilement.',
    bg: 'bg-blue-100 text-blue-600',
  },
]

const steps = [
  'Créez une catégorie pour votre projet.',
  'Ajoutez des posts pour vos tâches et idées.',
  'Suivez les détails et collaborez en équipe.',
  'Personnalisez vos cartes avec des couleurs.',
  'Commentez et partagez vos retours.',
  'Modifiez vos catégories ou posts à tout moment.',
]
</script>
