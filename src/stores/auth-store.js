import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@/api/api'
import { showError } from '@/helpers/toastHelper'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    UserAllInfo: null,
    loading: false,
    error: null,
    usersList: [],
  }),

  actions: {
    async fetchCurrentUser() {
      try {
        const res = await api.get('/users/me')
        return res.data
      } catch (err) {
        console.error(err)
        return null
      }
    },

    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post('https://mvvm-twp.kesug.com/wp-json/jwt-auth/v1/token', {
          username,
          password
        })

        if (data.token) {
          this.token = data.token
          this.user = {
            name: data.user_display_name,
            email: data.user_email,
            nicename: data.user_nicename
          }
          localStorage.setItem('wp_token', data.token)
          this.error = null
        } else {
          this.error = data.message || 'Login failed'
        }
      } catch (err) {

        if (err.response?.data?.code === 'jwt_auth_invalid_username') {
          this.error = "Nom d'utilisateur inconnu. Vérifie ou utilise ton email."
        } else if (err.response?.data?.code === 'jwt_auth_invalid_password') {
          this.error = "Mot de passe incorrect."
        } else {
          this.error = err.response?.data?.message || "Une erreur est survenue."
        }
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('wp_token')
    },

    loadTokenFromStorage() {
      const token = localStorage.getItem('wp_token')
      if (token) this.token = token
    },
    async fetchUsers() {
      if (!this.token) return
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/users')
        this.usersList = data
        console.log(this.usersList)
      } catch (err) {
        this.error = 'Impossible de récupérer les utilisateurs.'
        showError(this.error)
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      if (!this.token) return
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/users', userData)
        this.usersList.push(data)
      } catch (err) {
        this.error = 'Impossible de créer l’utilisateur.'
        showError(this.error)
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId) {
      if (!this.token) return
      this.loading = true
      this.error = null
      try {
        await api.delete(`/users/${userId}`)
        this.usersList = this.usersList.filter(u => u.id !== userId)
      } catch (err) {
        this.error = 'Impossible de supprimer l’utilisateur.'
        showError(this.error)
      } finally {
        this.loading = false
      }
    },

  },

  persist: {
    key: 'auth',
    paths: ['token', 'user'],
  },
})

