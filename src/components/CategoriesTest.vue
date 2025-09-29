<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Test CRUD Catégories</h2>

    <!-- Actions -->
    <div class="mb-4 space-x-2">
      <button @click="load" class="bg-green-800 text-white px-3 py-1 rounded">Charger</button>
      <button @click="add" class="bg-blue-800 text-white px-3 py-1 rounded"> Ajouter</button>
    </div>

    Messages
    <ul>
      <li
        v-for="cat in categoriesStore.categories"
        :key="cat.id"
        class="flex items-center justify-between border-b py-2"
      >
        <span>{{ cat.name }} (id: {{ cat.id }})</span>
        
        <div class="space-x-2">
          <button
            @click="update(cat.id)"
            class="bg-yellow-500 text-white px-2 py-1 rounded"
          >
             Modifier
          </button>
          <button
            @click="supprimer(cat.id)"
            class="bg-red-500 text-white px-2 py-1 rounded"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useCategoriesStore } from '@/stores/categories-store'

const categoriesStore = useCategoriesStore()

// Charger toutes les catégories
function load() {
  categoriesStore.getCategories()
}

// Ajouter une catégorie
function add() {
  const name = prompt("Nom de la nouvelle catégorie :", "Catégorie Test")
  if (name) {
    categoriesStore.createCategory({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    })
  }
}

// Modifier une catégorie
function update(id) {
  const name = prompt("Nouveau nom de la catégorie :")
  if (name) {
    categoriesStore.updateCategory(id, {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    })
  }
}

// Supprimer une catégorie
function supprimer(id) {
  if (confirm("Supprimer cette catégorie ?")) {
    categoriesStore.deleteCategory(id)
  }
}
</script>
  