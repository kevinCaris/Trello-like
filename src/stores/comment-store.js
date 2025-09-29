import { defineStore } from 'pinia'
import api from '@/api/api'
import { showError, showSuccess } from '@/helpers/toastHelper'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
    currentComment: null,
    loading: false,
    error: null,
  }),

  getters: {
    getCommentsByPost: (state) => (postId) => {
      return state.comments.filter((comment) => comment.post === postId)
    },
  },

  actions: {
    async fetchComments() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('comments')
        this.comments = response.data
        return this.comments
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async addComment(commentData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('comments', commentData)
        this.comments.push(response.data)
        showSuccess('Commentaire créé avec succès')
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Erreur création commentaire'

        showError(this.error)
      } finally {
        this.loading = false
      }
    },

    async updateComment(id, updatedData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`comments/${id}`, updatedData)
        const index = this.comments.findIndex((c) => c.id === id)
        if (index !== -1) this.comments[index] = response.data
        showSuccess('Commentaire modifié avec succès')
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Erreur modification commentaire'
        showError(this.error)
      } finally {
        this.loading = false
      }
    },

    async deleteComment(id) {
      this.loading = true
      this.error = null

      if(confirm("Veuillez confirmer la suppression du commentaire"))
      {
        try {
          await api.delete(`comments/${id}`)
          this.comments = this.comments.filter((c) => c.id !== id)
          showSuccess('Commentaire supprimé avec succès')
        } catch (err) {
          this.error = err.response?.data?.message || err.message || 'Erreur suppression commentaire'
          showError(this.error)
        } finally {
          this.loading = false
        }
      }
    },
  },

  persist: {
    key: 'comment',
    paths: ['comments'],
  },
})
