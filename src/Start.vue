<template>
  <div></div>
</template>
<script>
import { uid } from 'quasar'
export default {
  name: 'Start',
  mounted () {
    if (!localStorage.getItem('uuid')) {
      localStorage.setItem('uuid', 'tl' + uid())
    }
    return this.$router.replace({ name: 'list' })
  }
}
</script>
