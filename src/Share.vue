<template>
  <div></div>
</template>
<script>
import { uid } from 'quasar'
import PouchDB from 'pouchdb'
export default {
  name: 'Share',
  props: ['uuid', 'id'],
  async mounted () {
    const db = new PouchDB(this.uuid)
    await db.put({
      _id: uid(),
      type: 'Share',
      value: this.id
    })
    return this.$router.replace({ name: 'list' })
  }
}
</script>
