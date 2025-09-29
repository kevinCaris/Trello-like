import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mvvm-twp.kesug.com/wp-json/wp/v2/',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Basic ' + btoa('admin:FbLp 0G9G wDG5 BdZi r027 pgHG'),

  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  authStore.loadTokenFromStorage()
  if (authStore.token) {
    config.headers.Authorization = 'Bearer ' + authStore.token
  }
  return config
}, error => {
  return Promise.reject(error)
})
export default api;
