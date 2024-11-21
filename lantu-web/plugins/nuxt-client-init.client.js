//nuxt-client-init.client.js
/**
 * execute once after vue start
 */
export default async context => {
    await context.store.dispatch('nuxtClientInit', context)
}