<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="q-pa-md row justify-center items-start q-gutter-md">
          <div class="col-12 col-md-6 col-lg-5 col-xl-4">
            <q-card>
              <q-card-section class="bg-negative text-white text-center">
                <p class="text-h3"><q-icon name="warning" /> WARNING! <q-icon name="warning" /></p>
                <p class="text-subtitle1">You are about to delete all of your notes and checklists!</p>
              </q-card-section>
              <q-card-section>
                <p>This operation will delete all of your notes and checklists from this browser and on the database server.</p>
                <p>It will reset your experience to that of your first visit. <em>This cannot be undone!</em></p>
                <p>If you are certain you wish to delete your database, type "<code>delete</code>" in the box below and click the "Delete" button.</p>
                <q-input outlined v-model="confirmText" />
              </q-card-section>
              <q-card-section v-if="errorMsg">
                <p class="text-info">There was an error deleting your database: <code>{{ errorMsg }}</code></p>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn to="/">Cancel</q-btn>
                <q-btn color="negative" :disable="!confirmed" :loading="processing" @click="destroy">Delete</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { destroyDatabase } from './utils'
import PouchDB from 'pouchdb'
export default {
  name: 'Destroy',
  data () {
    return {
      id: localStorage.getItem('uuid'),
      confirmText: '',
      processing: false,
      errorMsg: false
    }
  },
  methods: {
    async destroy () {
      try {
        this.processing = true
        this.errorMsg = false
        const db = new PouchDB(this.id)
        await db.destroy()
        await destroyDatabase(this.id)
        localStorage.removeItem('uuid')
        window.location = '/'
      } catch (e) {
        console.error(e)
        this.errorMsg = e.message
        this.processing = false
      }
    }
  },
  computed: {
    confirmed () {
      return this.confirmText.toLowerCase() === 'delete'
    }
  },
  mounted () {
    if (!this.id) {
      const route = this.$router.resolve({ name: 'intro' })
      window.location = route.href
    }
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
