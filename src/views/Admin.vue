<template>
  <div
    class="min-h-screen h-64 overflow-auto bg-gradient-to-br from-indigo-200 via-white to-purple-300 p-8"
  >
    <header class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-gray-800">👥 Gestion des utilisateurs</h1>
      <p class="text-gray-600 mt-2 text-lg">
        Ajoutez, supprimez et gérez vos utilisateurs facilement.
      </p>
    </header>

    <!-- Ajouter un utilisateur -->
    <section class="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">➕ Ajouter un nouvel utilisateur</h2>
      <form @submit.prevent="handleCreateUser" class="grid gap-4">
        <input
          v-model="newUser.name"
          type="text"
          placeholder="Nom complet"
          class="input-field"
          required
        />
        <input
          v-model="newUser.username"
          type="text"
          placeholder="Nom d'utilisateur"
          class="input-field"
          required
        />
        <input
          v-model="newUser.email"
          type="email"
          placeholder="Email"
          class="input-field"
          required
        />
        <input
          v-model="newUser.password"
          type="password"
          placeholder="Mot de passe"
          class="input-field"
          required
        />
        <select v-model="newUser.roles" class="input-field">
          <option value="subscriber">Abonné</option>
          <option value="editor">Éditeur</option>
          <option value="author">Auteur</option>
          <option value="administrator">Administrateur</option>
        </select>
        <button
          type="submit"
          class="btn-primary w-full py-2 text-white font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
        >
          Ajouter
        </button>
        <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
      </form>
    </section>

    <!-- Liste des utilisateurs -->
    <section class="max-w-6xl mx-auto mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">🗂 Liste des utilisateurs</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="user in usersList"
          :key="user.id"
          class="bg-white shadow-md rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-xl transition transform"
        >
          <div
            class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl mb-4 font-bold text-indigo-600"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <h3 class="text-lg font-semibold text-gray-800">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
         
          <button
            @click="handleDeleteUser(user.id)"
            class="mt-4 bg-red-100 text-red-600 px-4 py-1 rounded-full hover:bg-red-200 transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
const error = ref(null)
const usersList = ref([])

const newUser = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  roles: 'subscriber',
})

const fetchUsers = async () => {
  try {
    await authStore.fetchUsers()
    usersList.value = authStore.usersList
  } catch (err) {
    error.value = 'Impossible de récupérer les utilisateurs.'
  }
}

const handleCreateUser = async () => {
  error.value = null
  try {
    await authStore.createUser({ ...newUser })
    fetchUsers()
    Object.keys(newUser).forEach((key) => (newUser[key] = key === 'roles' ? 'subscriber' : ''))
  } catch (err) {
    error.value = 'Impossible de créer l’utilisateur.'
    console.error(err)
  }
}

const handleDeleteUser = async (id) => {
  try {
    await authStore.deleteUser(id)
    fetchUsers()
  } catch (err) {
    error.value = 'Impossible de supprimer l’utilisateur.'
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.input-field {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}
.input-field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>
