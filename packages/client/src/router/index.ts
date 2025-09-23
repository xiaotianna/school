import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

const routes: RouterOptions['routes'] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue')
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/all',
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/Layout/All.vue')
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/Layout/Message.vue')
      },
      {
        path: 'content',
        name: 'Content',
        component: () => import('@/views/Layout/Content.vue')
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/Layout/Setting.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
