const routes = [
  {
    path: '/',
    component: () => { return localStorage.getItem('uuid') ? import('layouts/MainLayout.vue') : import('pages/Intro.vue') },
    children: [
      { path: '', name: 'list', component: () => import('pages/List.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/PageLayout.vue'),
    children: [
      { path: '/privacy', name: 'privacy', component: () => import('../pages/Privacy.vue') },
      { path: '/terms', name: 'terms', component: () => import('../pages/Terms.vue') },
      { path: '/destroy-database', name: 'destroy-database', component: () => import('../Destroy.vue') }
    ]
  },
  {
    path: '/get-started',
    name: 'get-started',
    component: () => import('../Start.vue')
  },
  {
    path: '/intro',
    name: 'intro',
    component: () => import('../pages/Intro.vue')
  },
  {
    path: '/link/:uuid',
    name: 'linkuuid',
    props: true,
    component: () => import('../Start.vue')
  },
  {
    path: '/share/:id',
    name: 'shareitem',
    props: true,
    component: () => import('../Share.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
