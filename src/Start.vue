<template>
  <div></div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'Start',
  mounted () {
    if (!localStorage.getItem('uuid')) {
      localStorage.setItem('uuid', uuidv4())
    }
    return this.$router.replace({ name: 'list' })
  }
}
</script>
