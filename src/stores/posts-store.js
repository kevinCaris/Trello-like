import { defineStore } from 'pinia';
import api from "@/api/api.js"

export const usePostStore = defineStore('posts', {
    //states
    state: () => ({
        items: [],
        loading: false,
        error: null,
    }),

    //getters
    getters: {
        byId: (state) => (id) => state.items.find(item => item.id === id),
        byCategory: (state) => (catId) => state.items.filter(item => (item.categories).includes(catId))
    },

    //actions
    actions: {
        async fetchAll() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get("/posts")
                const data = response.data
                this.items = data
            } catch (err) {
                console.error("Erreur FetchAll : ", err);
                this.error = err
            } finally {
                this.loading = false;
            }
        },

        async fetchByCategory(catId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get("/posts")
                const data = response.data
                const result = data.filter(item => (item.categories).includes(catId))
                this.items = result
                return result
            } catch (err) {
                console.error("Erreur fetchByCategory : ", err);
                this.error = err
                return []
            }
            finally {
                this.loading = false
            }
        },

        async createPost(payload) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post("/posts", payload);
                const newPost = response.data;
                console.log("Post créé:", newPost);
                return newPost;
            } catch (err) {
                console.log("Erreur createPost : ", err);
                this.error = err;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updatePost(id, updatedData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.put(`/posts/${id}`, updatedData);
                return response.data;
            } catch (err) {
                console.error("Erreur updatePost : ", err);
                this.error = err;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async deletePost(id) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/posts/${id}?force=true`)
            } catch (err) {
                console.error("Erreur deletePost : ", err);
                this.error = err;
                throw err;
            } finally {
                this.loading = false;
            }
        }

    },
    //persit value
    persist: {
        key: 'posts',
        paths: ["items", "loading", "error"]
    },
});