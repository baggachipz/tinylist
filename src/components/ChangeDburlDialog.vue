<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-advanced-settings">
      <q-card-section>
        <p>You can change the database your data syncs with -- for example, if you host your own CouchDB instance.</p>
        <q-banner v-if="error" class="bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          {{ error }}
        </q-banner>
        <q-input borderless v-model="val" label="Sync Database URL" />

      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancel" @click="onCancelClick" />
        <q-btn :color="$q.dark.isActive ? '' : 'primary'" :text-color="$q.dark.isActive ? 'primary' : ''" label="Save" @click="onSaveClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import PouchDB from 'pouchdb'
export default {
  props: [
    'value',
    'uuid'
  ],
  data () {
    return {
      val: this.value,
      error: false
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    async onSaveClick () {
      try {
        const db = new PouchDB(this.dbUrl + '/' + this.uuid)
        await db.info()
        this.$emit('ok', this.val)
        this.hide()
      } catch (e) {
        this.error = 'There was an error contacting the remote database. Please check your connection information and try again.'
      }
    },
    onCancelClick () {
      this.hide()
    }
  }
}
</script>
