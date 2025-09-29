<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Post Store Tester</h1>

    <section class="mb-4">
      <button class="px-3 py-1 border rounded mr-2" @click="fetchAll">Fetch All</button>
      <input v-model="catFilter" placeholder="Category ID" class="px-2 py-1 border rounded mr-2" />
      <button class="px-3 py-1 border rounded" @click="fetchByCategory">Fetch By Category</button>
      <span v-if="store.loading" class="ml-4">Loading...</span>
      <div v-if="store.error" class="mt-2 text-red-600">Error: {{ store.error.message || store.error }}</div>
    </section>

    <section class="mb-6 border p-4 rounded">
      <h2 class="font-semibold mb-2">Create new post</h2>
      <div class="grid grid-cols-1 gap-2">
        <input v-model="newPost.title" placeholder="Title" class="px-2 py-1 border rounded" />
        <textarea v-model="newPost.content" placeholder="Content" class="px-2 py-1 border rounded"></textarea>
        <input v-model="newPost.categoriesStr" placeholder="Categories (séparer par des ,)" class="px-2 py-1 border rounded" />
        <div>
          <button class="px-3 py-1 border rounded" @click="createPost">Create</button>
          <button class="px-3 py-1 border rounded ml-2" @click="resetCreate">Reset</button>
        </div>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="font-semibold mb-2">Posts ({{ store.items.length }})</h2>
      <ul>
        <li v-for="post in store.items" :key="post.id" class="mb-3 p-3 border rounded">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-semibold">{{ post.title.rendered }}</div>
              <div class="text-sm">ID: {{ post.id }}</div>
              <div class="text-sm">Categories: {{ post.categories && post.categories.join(', ') }}</div>
              <div class="mt-2">{{ post.content.rendered }}</div>
            </div>
            <div class="ml-4 flex-shrink-0">
              <button class="px-2 py-1 border rounded mb-2 block" @click="startEdit(post)">Edit</button>
              <button class="px-2 py-1 border rounded block" @click="removePost(post.id)">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="editing" class="mb-6 border p-4 rounded">
      <h2 class="font-semibold mb-2">Edit post (ID: {{ editData.id }})</h2>
      <input v-model="editData.title.rendered" placeholder="Title" class="px-2 py-1 border rounded w-full mb-2" />
      <textarea v-model="editData.content.rendered" placeholder="Content" class="px-2 py-1 border rounded w-full mb-2"></textarea>
      <input v-model="editData.categoriesStr" placeholder="Categories (séparer par des ,)" class="px-2 py-1 border rounded w-full mb-2" />
      <div>
        <button class="px-3 py-1 border rounded" @click="updatePost">Save</button>
        <button class="px-3 py-1 border rounded ml-2" @click="cancelEdit">Cancel</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { usePostStore } from '@/stores/posts-store.js'

const store = usePostStore()

const catFilter = ref('')

const newPost = reactive({ title: '', content: '', categoriesStr: '' })

const createPost = async () => {
  const categories = parseCategories(newPost.categoriesStr)
  const payload = {
    title: newPost.title,
    content: newPost.content,
    status: "publish",
    categories,
  }
  await store.createPost(payload)
  if (!store.error) resetCreate()
}

const resetCreate = () => {
  newPost.title = ''
  newPost.content = ''
  newPost.categoriesStr = ''
}

const fetchAll = async () => {
  await store.fetchAll()
}

const fetchByCategory = async () => {
  if (!catFilter.value) return
  await store.fetchByCategory(parseInt(catFilter.value.trim()))
}

const removePost = async (id) => {
  if (!confirm(`Delete post ${id}?`)) return
  await store.deletePost(id)
}

const editing = ref(false)
const editData = reactive({ id: null, title: '', content: '', categoriesStr: '' })

const startEdit = (post) => {
  editing.value = true
  editData.id = post.id
  editData.title = post.title || ''
  editData.content = post.content || ''
  editData.categoriesStr = (post.categories || []).join(',')
}

const cancelEdit = () => {
  editing.value = false
  editData.id = null
}

const updatePost = async () => {
  const categories = parseCategories(editData.categoriesStr)
  const updated = {
    title: editData.title.rendered,
    content: editData.content.rendered,
    categories,
  }
  await store.updatePost(editData.id, updated)
  if (!store.error) cancelEdit()
}

function parseCategories(str) {
  if (!str) return []
  return str.split(',').map(s => {
    const t = s.trim()
    const n = Number(t)
    return Number.isNaN(n) ? t : n
  }).filter(Boolean)
}
</script>

<style scoped>
</style>
