<template>
  <div></div>
</template>
<script>
import { uid } from 'quasar'
import { createDatabase } from './utils'
export default {
  name: 'Start',
  props: ['uuid'],
  async mounted () {
    if (this.uuid) {
      localStorage.setItem('uuid', this.uuid)
    } else {
      if (!localStorage.getItem('uuid')) {
        const id = 'tl' + uid()
        try {
          await createDatabase(id)
          localStorage.setItem('uuid', id)
          const route = this.$router.resolve({ name: 'list' })
          window.location = route.href
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
</script>
