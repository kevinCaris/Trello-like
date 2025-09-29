<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="emit('close')">
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    <!-- Contenu de la modale -->
    <div
      @click.stop
      class="relative bg-white dark:bg-gray-900 w-full max-w-7xl rounded-lg shadow-xl overflow-hidden flex flex-col h-10/12"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800"
      >
        <input
          v-model="editableName"
          @blur="saveTitle"
          class="text-white font-bold text-[1.1rem] bg-transparent border-0 flex-1 mr-3 outline-none placeholder:text-white/60 focus:ring-0 hover:cursor-default focus:cursor-text text-center"
          placeholder="Nom de la carte"
        />
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-red-600 hover:cursor-pointer font-semibold"
        >
          ✕
        </button>
      </div>

      <!-- Corps -->
      <div class="p-6 grid grid-cols-3 overflow-y-auto gap-5 text-white justify-between">
        <div class="col-span-2">
          <h3 class="font-semibold text-gray-100">Description</h3>
          <form @submit.prevent="saveContent">
            <textarea
              v-model="localContent"
              class="w-full h-90 p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white hover:cursor-default focus:cursor-text"
            ></textarea>
            <div
              class="flex justify-start items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="submit"
                class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800 transition hover:cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>

        <!-- Espace Commentaire -->
        <div>
          <h3 class="font-semibold text-gray-100">Commentaires</h3>
          <div
            class="h-90 w-full rounded-md border p-3 border-gray-300 dark:border-gray-600 overflow-y-auto"
          >
            <CommentSection :initialComments="comments" :post="props.post" @refresh="refresher" />
          </div>
        </div>
      </div>

      <!-- Footer -->
    </div>
  </div>
</template>

<script setup>
import CommentSection from '@/components/CommentSection.vue'

import { nextTick, onMounted, ref, watch } from 'vue'
import { stripHtml, decodeHtml } from '@/utils/text'
import { usePostStore } from '@/stores/posts-store'
import { showError, showSuccess } from '@/helpers/toastHelper'
import { useCommentStore } from '@/stores/comment-store'

const store = usePostStore()

const props = defineProps({
  post: Object,
})

const editableName = ref(props.post.title.rendered)

const emit = defineEmits(['close', 'save', 'edited'])

const localContent = ref(stripHtml(props.post.content.rendered))

const commentStore = useCommentStore()

const comments = ref()

async function loadComments() {
  comments.value = await commentStore.getCommentsByPost(props.post?.id)
}


onMounted(async () => loadComments())

// Mise à jour du titre et du contenu en cas de changement
watch(
  () => decodeHtml(stripHtml(props.post.title.rendered)),
  (val) => (editableName.value = val),
)

watch(
  () => decodeHtml(stripHtml(props.post.content.rendered)),
  (val) => (localContent.value = val),
)


async function saveTitle() {
  if (!editableName.value.trim()) {
    showError('Le titre ne peut être vide')
    return
  }

  if (editableName.value.trim().length > 100) {
    showError('Le titre ne doit dépasser 100 caractères')
    return
  }

  if (editableName.value.trim() && editableName.value !== props.post.title.rendered) {
    try {
      await store.updatePost(props.post.id, {
        title: editableName.value,
      })
      emit('edited')
      showSuccess('Titre modifié')
    } catch (error) {
      showError('Erreur lors de la modification du titre')
      console.log(error)
    }
  }
}

async function refresher() {
  await loadComments()
}

async function saveContent() {
  if (localContent.value.trim().length > 1000) {
    showError('Le contenu ne doit dépasser 1000 caractères')
    return
  }
  if (localContent.value.trim() && localContent.value !== props.post.content.rendered) {
    try {
      await store.updatePost(props.post.id, {
        content: localContent.value,
      })
      emit('edited')
      showSuccess('Contenu enregistré')
    } catch (error) {
      showError('Erreur lors de la modification du contenu')
      console.log(error)
    }
  }
}
</script>
