
const routes = [
  {
    path: '/',
    component: () => { return localStorage.getItem('uuid') ? import('layouts/MainLayout.vue') : import('pages/Intro.vue') },
    children: [
      { path: '', name: 'list', component: () => import('pages/List.vue') }
    ]
  },
  {
    path: '/get-started',
    name: 'get-started',
    component: () => import('../Start.vue')
  },
  {
    path: '/link/:uuid',
    name: 'linkuuid',
    props: true,
    component: () => import('../Start.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
