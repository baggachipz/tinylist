import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const router = createRouter({
    history: createWebHistory(process.env.VUE_ROUTER_BASE), // Use createWebHistory for Vue 3
    routes,
    scrollBehavior: () => ({ x: 0, y: 0 })
  })

  return router
}
