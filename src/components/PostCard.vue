<template>
  <div class="flex-1 p-3 space-y-3">
    <div
      v-if="!isEditing"
      @click="showDetails"
      class="relative bg-gray-50 rounded-md p-3 border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-500 cursor-pointer group hover:-translate-y-1"
    >
      <div class="mb-2">
        <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
          {{ getPostTitle(post) }}
        </h4>
      </div>

      <div class="text-xs text-gray-600 mb-2 line-clamp-3">
        {{ getPostContent(post) }}
      </div>

      <div class="absolute top-2 right-2 flex justify-between items-center">
        <div class="flex gap-1">
          <button
            @click.stop="startEdit"
            class="text-xs px-2 py-1 rounded-full hover:bg-gray-200 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition transition-discrete duration-500 hover:scale-120 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
          <button
            @click.stop="deletePost"
            class="text-xs px-2 py-1 rounded-full hover:bg-gray-200 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition transition-discrete duration-700 hover:scale-120 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <form
      v-if="isEditing"
      @submit.prevent="saveEdit"
      class="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg mb-3 animate-slideDown"
    >
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Titre :</label>
        <input
          v-model="editTitle"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          type="text"
          required
          placeholder="Entrez le titre de la carte"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Contenu :</label>
        <textarea
          v-model="editContent"
          @click.stop
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 custom-scrollbar"
          rows="3"
          placeholder="Décrivez votre carte..."
        ></textarea>
      </div>

      <div class="flex gap-2 justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 flex items-center gap-1 hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
        <button
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 flex items-center gap-1 hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>

    <PostModal v-if="showModal" :post="post" @close="closeDetails" @edited="emit('edited')"/>
  </div>
</template>

<script setup>
import PostModal from './PostModal.vue'
import { ref } from 'vue'
import { usePostStore } from '@/stores/posts-store.js'
import { showError, showSuccess } from '@/helpers/toastHelper'
import { decodeHtml } from '@/utils/text'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const store = usePostStore()
const isEditing = ref(false)
const showModal = ref(false)
const editTitle = ref('')
const editContent = ref('')

const emit = defineEmits(['edited', 'deleted'])

const getPostTitle = (post) => {
  if (typeof post.title === 'object' && post.title.rendered) {

    return decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))
  }
  return decodeHtml(post.title) || 'Sans titre'
}

const getPostContent = (post) => {
  let content = ''
  if (typeof post.content === 'object' && post.content.rendered) {
    return decodeHtml(post.content.rendered.replace(/<[^>]*>/g, '').substring(0, 80))
  }
}

const startEdit = () => {
  editTitle.value = getPostTitle(props.post)
  editContent.value = getPostContent(props.post)
  isEditing.value = true
}

const saveEdit = async () => {

  if(!editTitle.value.trim())
  {    
    showError('Le titre ne peut être vide')
    return
  }

  if((editTitle.value.trim()).length > 100)
  {
    showError('Le titre ne doit dépasser 100 caractères')
    return
  }

  if ((editContent.value.trim()).length > 1000) {
    showError('Le contenu ne doit dépasser 1000 caractères')
    return    
  }

  try {
    await store.updatePost(props.post.id, {
      title: editTitle.value,
      content: editContent.value,
    })
    showSuccess('Modification effectuée')
    emit('edited')
    isEditing.value = false
    console.log('edited')
  } catch (error) {
    showError('Erreur lors de la modification')
    console.log(error)
  }
}

async function categoryChange(){
  await store.updatePost(props.post.id, {
    categories: props.newCategoryId
  })
}

const cancelEdit = () => {
  isEditing.value = false
}

const deletePost = async () => {
  if (confirm('Supprimer ce post ?')) {
    try {
      await store.deletePost(props.post.id)
      showSuccess('Suppression effectuée')
      emit('deleted')
    } catch (error) {
      showError('Erreur lors de la suppression')
      console.log(error)
    }
  }
}

const showDetails = () => {
  showModal.value = true
}

const closeDetails = () => {
  showModal.value = false
}
</script>

<style scoped>

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

</style>
