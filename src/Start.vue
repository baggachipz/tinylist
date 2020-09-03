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
        localStorage.setItem('uuid', id)
        try {
          const response = await createDatabase(id)
          console.debug(response)
        } catch (e) {
          console.log(e)
        }
      }
    }
    return this.$router.replace({ name: 'list' })
  }
}
</script>
