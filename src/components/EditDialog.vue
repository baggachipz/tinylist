<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <component v-bind:is="editType" v-model="value">
        <template v-slot:bottom-toolbar-left>
          <div class="action-buttons">
            <q-btn flat round icon="delete" @click="deleteItem" />
          </div>
        </template>
        <template v-slot:bottom-toolbar-right>
          <q-btn color="primary" label="Save" @click="onSaveClick" />
        </template>
      </component>
    </q-card>
  </q-dialog>
</template>
<script>
import EditChecklist from './Checklist/EditChecklist'

export default {
  name: 'EditDialog',
  components: { EditChecklist },
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
    onSaveClick () {
      this.$emit('ok', this.value)
      this.hide()
    },
    deleteItem () {
      this.$emit('delete', this.value._id)
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
