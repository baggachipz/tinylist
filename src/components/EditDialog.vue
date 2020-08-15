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
    hide () {
      // required by name for QDialog plugin
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },
    onCloseClick () {
      // if new item box has a value in it, add as an item before close
      if (this.$refs['edit-component'].createNewItem) this.$refs['edit-component'].createNewItem()
      this.$emit('ok', this.value)
      this.hide()
    },
    deleteItem () {
      // commandeer the cancel function to use for deletion
      this.$emit('cancel', this.value._id)
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
