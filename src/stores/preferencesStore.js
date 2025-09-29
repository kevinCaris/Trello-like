import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        listColors: {},
        currentBg: null,
    }),
    actions: {
        setListColor(categoryId, color) {
            this.listColors[categoryId] = color
            localStorage.setItem('listColors', JSON.stringify(this.listColors))
        },
        setBackground(url) {
            this.currentBg = url
            localStorage.setItem('currentBg', url)
        },
        loadPreferences() {
            const savedColors = localStorage.getItem('listColors')
            if (savedColors) this.listColors = JSON.parse(savedColors)
            const savedBg = localStorage.getItem('currentBg')
            if (savedBg) this.currentBg = savedBg
        },
    },
})
