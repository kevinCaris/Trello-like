<template>
  <div
    class="list min-w-[290px] max-w-[400px] dark:bg-gray-800 rounded-xl flex flex-col max-h-[90vh] shadow-sm"
    :style="{ backgroundColor: listColor }"
  >
    <!-- Header -->
    <div class="p-3 rounded-t-xl dark:bg-gray-800">
      <div class="mx-3 my-2 flex gap-2 flex-wrap text-center">
        <button
          v-for="color in colors"
          :key="color"
          :style="{ backgroundColor: color }"
          @click="changeColor(color)"
          class="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
        ></button>
      </div>
      <div class="flex items-center justify-between">
        <input
          v-model="editableName"
          @blur="saveName"
          @keyup.enter="saveName"
          class="text-white font-bold text-[1.1rem] bg-transparent border-0 flex-1 mr-3 outline-none placeholder:text-white/60 focus:border-b-2 focus:border-[#0079bf] focus:ring-0 hover:cursor-default focus:cursor-text"
          placeholder="Nom de la liste"
        />
        <button
          class="p-2 rounded-md text-red-500 hover:text-red-600 active:scale-95 transition-transform hover:cursor-pointer"
          @click="deleteList"
          aria-label="Supprimer la liste"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Cards -->
    <draggable
      v-model="posts"
      group="cards"
      item-key="id"
      class="cards flex-1 flex flex-col overflow-y-auto gap-2 p-2 custom-scrollbar"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <PostCard
          :post="element"
          @edited="loader"
          @deleted="loader"
          @click="openCardModal(element)"
        />
      </template>
    </draggable>

    <!-- Add Card Section -->
    <div class="p-3">
      <form
        v-if="isCreating"
        @submit.prevent="addCard"
        class="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg mb-3 animate-slideDown"
      >
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre :</label>
          <input
            v-model="form.title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            type="text"
            required
            placeholder="Entrez le titre de la carte"
            ref="titleInput"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contenu :</label>
          <textarea
            v-model="form.content"
            @click.stop
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 custom-scrollbar"
            rows="3"
            placeholder="Décrivez votre carte..."
          ></textarea>
        </div>

        <div class="flex gap-2 justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 flex items-center gap-1 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
          <button
            type="button"
            @click="cancelCreate"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 flex items-center gap-1 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </form>

      <button
        v-if="!isCreating"
        class="w-full h-10 rounded-lg font-medium text-white hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 border border-white/20 hover:cursor-pointer"
        @click="startCreating"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Ajouter une carte
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, nextTick } from 'vue'
import { useCategoriesStore } from '@/stores/categories-store'
import { usePostStore } from '@/stores/posts-store'
import PostCard from './PostCard.vue'
import draggable from 'vuedraggable'
import { showError, showSuccess } from "@/helpers/toastHelper";

import { usePreferencesStore } from '@/stores/preferencesStore'

const preferences = usePreferencesStore()

const props = defineProps({ category: Object })

const newCategoryIdCorrect = ref(null)
const emit = defineEmits(['deleted'])

let isCreating = ref(false)

let form = reactive({
  title: '',
  content: '',
  status: 'publish',
  categories: parseInt(props.category.id),
})

const categoriesStore = useCategoriesStore()
const postsStore = usePostStore()
const posts = ref([])
const editableName = ref(props.category.name)
const selectedCard = ref(null)
const titleInput = ref(null)

// Couleur de la liste
const colors = [
  '#FFFFFF3A',
  '#0079bf60',
  '#d2903460',
  '#51983960',
  '#b0463260',
  '#89609e60',
  '#cd5a9160',
  '#4bbf6b60',
  '#00aecc60',
]

const listColor = ref(preferences.listColors[props.category.id] || colors[0])

function changeColor(color) {
  listColor.value = color
  preferences.setListColor(props.category.id, color)
}

// Chargement des cartes
async function loader() {
  const result = await postsStore.fetchByCategory(props.category.id)
  posts.value = result.filter((post) => post && post.id)
}

onMounted(() => {
  loader()
})

// Sauvegarder le nom
async function saveName() {
  if (editableName.value.trim() && editableName.value !== props.category.name) {
    await categoriesStore.updateCategory(props.category.id, { name: editableName.value })
  }
}

// Supprimer la liste
async function deleteList() {
  if (confirm('Supprimer cette liste ?')) {
    await categoriesStore.deleteCategory(props.category.id)
    emit('deleted')
  }
}

// Démarrer la création d'une carte
async function startCreating() {
  isCreating.value = true
  await nextTick()
  if (titleInput.value) {
    titleInput.value.focus()
  }
}

// Ajouter carte
async function addCard() {
  if(!form.title.trim())
  {    
    showError('Le titre ne peut être vide')
    return
  }

  if((form.title.trim()).length > 100)
  {
    showError('Le titre ne doit dépasser 100 caractères')
    return
  }

  if ((form.content.trim()).length > 1000) {
    showError('Le contenu ne doit dépasser 1000 caractères')
    return    
  }

  try {
    const data = {
      title: form.title,
      content: form.content,
      status: form.status,
      categories: form.categories,
    }

    const newCard = await postsStore.createPost(data)

    if (newCard && newCard.id) {
      await loader()

      // Reset du formulaire
      form.title = ''
      form.content = ''
      isCreating.value = false
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout:", error)
  }
}

// Drag & Drop
const onDragChange = async (evt) => {
  if (!evt) return

  if (evt.added) {
    const card = evt.added.element
    const cardId = card?.id
    const newCategoryId = Number(props.category.id)

    if (!cardId) return

    const existing = card.categories
    const existingFirst = Array.isArray(existing) ? Number(existing[0]) : Number(existing)

    if (existingFirst !== newCategoryId) {
      try {
        await postsStore.updatePost(cardId, { categories: [newCategoryId] })
        card.categories = [newCategoryId]
        await loader()
      } catch (err) {
        console.error('Erreur drag & drop:', err)
      }
    }
  }
}

// Gestion modale
function openCardModal(card) {
  selectedCard.value = card
}

function closeCardModal() {
  selectedCard.value = null
}

function cancelCreate() {
  form.title = ''
  form.content = ''
  isCreating.value = false
}

watch(
  () => props.category.name,
  (val) => (editableName.value = val),
)
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
</style>
