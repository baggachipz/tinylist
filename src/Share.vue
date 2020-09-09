<template>
  <div>Setting up your share....</div>
</template>
<script>
import { uid } from 'quasar'
import PouchDB from 'pouchdb'
export default {
  name: 'Share',
  props: ['id'],
  async mounted () {
    const uuid = localStorage.getItem('uuid')
    if (!uuid) {
      return this.$router.replace({ name: 'intro' })
    }
    const db = new PouchDB(uuid)
    await db.put({
      _id: uid(),
      type: 'Share',
      value: this.id,
      sort: -1
    })
    return this.$router.replace({ name: 'list' })
  }
}
</script>
