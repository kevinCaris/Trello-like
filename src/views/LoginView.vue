<template>
  <body
    class="flex font-poppins items-center justify-center dark:bg-gray-900 min-w-screen min-h-screen"
  >
    <div class="grid gap-8 max-w-md w-full overflow-auto max-h-[90vh]">
      <div id="back-div" class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-2">
        <div
          class="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-5 2xl:p-5 lg:p-5 md:p-10 sm:p-2 m-1"
        >
          <h1 class="pt-2 pb-6 font-bold text-4xl dark:text-gray-400 text-center cursor-default">
            Connexion
          </h1>
          <p v-if="auth.error" class="text-red-500 text-center mt-4">{{ auth.error }}</p>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="mb-4 dark:text-gray-400 text-lg">Nom d'utilisateur</label>
              <input
                @input="auth.error = null"
                maxlength="1000"
                v-model="username"
                id="email"
                class="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                type="text"
                placeholder="Nom d'utilsateur ou email"
                required
              />
            </div>
            <div>
              <label for="password" class="mb-2 dark:text-gray-400 text-lg">Mot de passe</label>
              <input
                @input="auth.error = null"
                id="password"
                v-model="password"
                class="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                type="password"
                placeholder="Mot de passe"
                required
              />
            </div>
            <button
              :disabled="auth.loading"
              class="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out hover:cursor-pointer"
              type="submit"
            >
              {{ auth.loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
          <div class="flex flex-col mt-4 items-center justify-center text-sm">
            <h3>
              <span class="cursor-default dark:text-gray-300">Vous n'avez pas de compte?</span>
              <a class="group text-blue-400 transition-all duration-100 ease-in-out" href="#">
                <span
                  class="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  S'inscrire
                </span>
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { showSuccess } from '@/helpers/toastHelper'
import { useAuthStore } from '@/stores/auth-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

async function handleLogin() {
  await auth.login(username.value, password.value)
  if (auth.token) {
    router.push('/')
    showSuccess('Connecté avec succès')
  }
}
</script>
