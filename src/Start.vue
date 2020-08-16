<template>
  <div></div>
</template>
<script>
import { uid } from 'quasar'
export default {
  name: 'Start',
  props: ['uuid'],
  mounted () {
    if (this.uuid) {
      localStorage.setItem('uuid', this.uuid)
    } else {
      if (!localStorage.getItem('uuid')) {
        localStorage.setItem('uuid', 'tl' + uid())
      }
    }
    return this.$router.replace({ name: 'list' })
  }
}
</script>
