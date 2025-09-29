<template>
  <div class="board h-full overflow-x-auto p-8 custom-scrollbar">
    <div class="flex gap-6 items-start">
      <!-- Colonnes -->
      <ListeCard v-for="cat in categoriesStore.categories" :key="cat.id" :category="cat" />

      <!-- Bloc Ajouter une liste -->
      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-w-[250px] flex-shrink-0">
        <button
          v-if="!openForm"
          class="text-gray-700 dark:text-gray-200 font-medium flex hover:cursor-pointer"
          @click="openForm = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter une autre liste
        </button>

        <div v-else class="space-y-3">
          <input
            v-model="newCategory"
            @blur="saveName"
            placeholder="Saisissez le nom de votre liste..."
            class="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div class="flex items-center gap-2">
            <button
              class="bg-blue-600 text-white rounded-md px-3 py-2 hover:bg-blue-700 hover:cursor-pointer"
              @click="addList"
            >
              + Ajouter une liste
            </button>
            <button class="text-gray-500 hover:text-red-500  hover:rounded-md hover:cursor-pointer" @click="openForm = false">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ListeCard from '@/components/ListeCard.vue'
import { useCategoriesStore } from '@/stores/categories-store'
import { onMounted, ref } from 'vue'

const openForm = ref(false)
const categoriesStore = useCategoriesStore()

const newCategory = ref('')

onMounted(() => {
  categoriesStore.getCategories()
})

function addList() {
  const slug = 'liste-' + Date.now()
  categoriesStore.createCategory({ name: newCategory.value, slug })
  newCategory.value = ''
  openForm.value = false
}
</script>

<style scoped>
.content {
  height: 150px;
  border-radius: 5px;
}
.add-list {
  color: white;
  border: 1 solid;
  cursor: pointer;
  font-weight: bold;
}

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
</style>
