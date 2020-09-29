<template>
  <q-layout>
    <q-page-container>
      <q-page class="msg-bg">
        <div class="row">
          <div class="col msg text-body1"><p><q-spinner-ball size="3em" /></p><p>Setting up your share....</p></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { uid } from 'quasar'
import { createDatabase } from './utils'
import PouchDB from 'pouchdb'
export default {
  name: 'Share',
  props: ['id'],
  async mounted () {
    // create database if it doesn't exist yet
    if (!localStorage.getItem('uuid')) {
      const id = 'tl' + uid()
      try {
        await createDatabase(id)
        localStorage.setItem('uuid', id)
      } catch (e) {
        console.log(e)
      }
    }
    // get db and store the new item
    const uuid = localStorage.getItem('uuid')
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
<style lang="sass" scoped>
  .msg-bg
    background: $amber-1
  .msg
    color: $grey-7
    font-size: 2em
    text-align: center
    position: absolute
    top: 50%
    left: 50%
    -ms-transform: translateX(-50%) translateY(-50%)
    -webkit-transform: translate(-50%,-50%)
    transform: translate(-50%,-50%)
</style>
