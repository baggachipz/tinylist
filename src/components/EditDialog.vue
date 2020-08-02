<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <component v-bind:is="editType" v-model="value" />
      <q-card-actions>
        <div class="action-buttons">
          <q-btn flat round icon="delete" @click="deleteItem" />
        </div>
        <q-space />
        <q-btn color="primary" label="Close" @click="onCloseClick" />
      </q-card-actions>
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
    onCloseClick () {
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
