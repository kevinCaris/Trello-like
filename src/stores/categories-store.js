import { defineStore } from 'pinia'
import api from '@/api/api'
import { showSuccess, showError } from "@/helpers/toastHelper"

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        category: null,
        loading: false,
        error: null,
    }),

    actions: {
        async getCategories() {
            this.loading = true
            this.error = null
            try {
                const res = await api.get('/categories')
                this.categories = Array.isArray(res.data) ? res.data : []
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Erreur chargement catégories'
                showError(this.error)
            } finally {
                this.loading = false
            }
        },

        async createCategory(data) {
            this.loading = true
            this.error = null
            try {
                const res = await api.post('/categories', data)
                const newCategory = res.data
                this.categories.push(newCategory)
                showSuccess("Catégorie créée avec succès")
                return newCategory
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Erreur création catégorie'
                showError(this.error)
            } finally {
                this.loading = false
            }
        },

        async updateCategory(id, data) {
            this.loading = true
            this.error = null
            try {
                const cat = this.categories.find(c => c.id === id)
                if (!cat) {
                    showError("Catégorie inexistante")
                    return
                }

                const res = await api.put(`/categories/${id}`, data)
                const updated = res.data

                const index = this.categories.findIndex(c => c.id === id)
                if (index !== -1) this.categories[index] = updated
                else this.categories.unshift(updated)

                if (this.category && this.category.id === id) this.category = updated
                showSuccess("Catégorie mise à jour avec succès")
                return updated
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Erreur mise à jour catégorie'
                showError(this.error)
            } finally {
                this.loading = false
            }
        },

        async deleteCategory(id) {
            this.loading = true
            this.error = null
            try {
                const cat = this.categories.find(c => c.id === id)
                if (!cat) {
                    showError("Catégorie inexistante")
                    return
                }

                await api.delete(`/categories/${id}?force=true`)

                this.categories = this.categories.filter(c => c.id !== id)

                if (this.category && this.category.id === id) this.category = null

                showSuccess("Catégorie supprimée avec succès")
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Erreur suppression catégorie'
                showError(this.error)
            } finally {
                this.loading = false
            }
        }
    },

    persist: {
        key: 'categories',
        paths: ['categories', 'category'],
    }
})
