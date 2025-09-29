import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store';


import AuthLayout from '@/layouts/AuthLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';

import Home from '@/views/Home.vue';
import Board from '@/views/Board.vue';
import LoginView from '@/views/LoginView.vue';
import Admin from '@/views/Admin.vue';



const routes = [
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "home", component: Home },
      { path: "board", name: "board", component: Board },
      { path: "admin", name: "admin", component: Admin }

    ]
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      { path: "", name: "login", component: LoginView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.token) {
    return { name: 'home' }
  }
})


export default router
