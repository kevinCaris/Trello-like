<template>
  <div class="space-y-4">
    <div v-for="comment in comments" :key="comment.id" class="flex space-x-3 items-start">
      <!-- Avatar -->
      <img :src="comment.author_avatar_urls[48]" class="w-8 h-8 rounded-full" />

      <!-- Contenu -->
      <div class="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-md relative max-w-full">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{
            comment.author_name
          }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{
            formatDate(comment.date)
          }}</span>
        </div>

        <div v-if="editingId !== comment.id" class="text-gray-200 break-words">
          {{ decodeHtml(stripHtml(comment.content.rendered)) }}
        </div>
        <textarea
          maxlength="5000"
          v-else
          v-model="editContent"
          class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        ></textarea>

        <!-- Actions -->
        <div class="flex justify-end mt-2 space-x-2 text-gray-400">
          <button
            v-if="editingId !== comment.id"
            @click="startEdit(comment)"
            class="hover:text-blue-500 hover:cursor-pointer"
          >
            <div class="flex gap-2">
              Modifier
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
          </button>
          <button
            v-if="editingId === comment.id"
            @click="saveEdit(comment)"
            class="hover:text-blue-500 hover:cursor-pointer"
          >
            <div class="flex gap-2">
              Enregistrer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </button>
          <button v-if="editingId === comment.id" @click="editingId = null" class="hover:text-red-500 hover:cursor-pointer">
            <div class="flex gap-2">
              Annuler
            </div>
          </button>
          <button v-else @click="deleteComment(comment)" class="hover:text-red-500 hover:cursor-pointer">
            <div class="flex gap-2">
              Supprimer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>  
            </div>
          </button>
          <button @click="replyToComment(comment)" class="hover:text-blue-500">res</button>
        </div>
      </div>
    </div>

    <!-- Ajouter un nouveau commentaire -->
    <div class="space-x-2 mt-4">
      <input
        v-model="newComment"
        placeholder="Ajouter un commentaire..."
        class="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />
      <button
        @click="add"
        class="px-2 py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition hover:cursor-pointer"
      >
        Ajouter
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/comment-store'
import { ref, watch } from 'vue'
import { stripHtml, decodeHtml } from '@/utils/text'
import { formatDate } from '@/utils/date'
import { useAuthStore } from '@/stores/auth-store'

const commentStore = useCommentStore()
const userStore = useAuthStore()

const currentUser = userStore.user.name

const props = defineProps({
  initialComments: { type: Array, default: () => [] },
  post: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['refresh'])

const comments = ref([...props.initialComments])

// Edition
const editingId = ref(null)
const editContent = ref('')

function startEdit(comment) {
  editingId.value = comment.id
  editContent.value = decodeHtml(comment.content.rendered)
}

async function saveEdit(comment) {
  if (!editContent.value.trim()) return
  try {
    await commentStore.updateComment(comment.id, {
      content: editContent.value,
    })
    comment.content.rendered = editContent.value
    editingId.value = null
    emits('refresh')
  } catch (err) {
    console.error('Erreur update comment:', err)
  }
}

// Ajouter un commentaire
const newComment = ref('')

async function add() {
  if (!newComment.value.trim()) return
  try {
    await commentStore.addComment({
      post: props.post.id,
      content: newComment.value,
    })
    emits('refresh')
    newComment.value = ''
  } catch (err) {
    console.error('Erreur add comment:', err)
  }
}

watch(
  () => props.initialComments,
  (val) => (comments.value = val),
)

// Supprimer un commentaire
async function deleteComment(comment) {
  try {
    await commentStore.deleteComment(comment.id)
    emits('refresh')
  } catch (err) {
    console.error('Erreur delete comment:', err)
  }
}

// Répondre
function replyToComment(comment) {
  alert(`Répondre à ${comment.author_name}`)
}
</script>
