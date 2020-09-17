<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <component v-bind:is="editType" v-model="value" ref="edit-component">
        <template v-slot:bottom-toolbar-left>
          <div class="action-buttons">
            <q-btn flat round icon="delete" @click="deleteItem">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </div>
        </template>
        <template v-slot:bottom-toolbar-right>
          <div class="action-buttons">
            <q-btn v-if="!value.new" flat round icon="share" @click.prevent="shareItem">
              <q-tooltip>Share</q-tooltip>
            </q-btn>
          </div>
          <q-btn color="primary" label="Close" @click="onCloseClick" />
        </template>
      </component>
    </q-card>
  </q-dialog>
</template>
<script>
import EditChecklist from './Checklist/EditChecklist'
import EditNote from './Note/EditNote'

export default {
  name: 'EditDialog',
  components: { EditChecklist, EditNote },
  props: ['value'],
  methods: {
    show () {
      // required by name for QDialog plugin
      this.$refs.dialog.show()
    },
    async hide (ok) {
      // required by name for QDialog plugin
      await this.$refs.dialog.hide()
      if (ok) {
        this.$emit('ok', this.value)
      } else {
        this.$emit('cancel')
      }
    },
    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },
    onCloseClick () {
      this.hide(!this.value.new || this.$refs['edit-component'].hasData())
    },
    deleteItem () {
      this.$parent.$parent.deleteItem(this.value._id)
      this.hide()
    },
    shareItem () {
      this.$parent.$parent.onShare(this.value)
      this.hide()
    }
  },
  computed: {
    editType () {
      return `Edit${this.value.type}`
    }
  }
}
</script>
<style lang="sass" scoped>
  .action-buttons
    color: $grey-7
    button
      &:hover
        color: black
</style>
