<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <component v-bind:is="editType" v-model="innerValue" :_id="_id" />
      <q-card-actions align="right">
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
  props: ['value', 'type', '_id'],
  data () {
    return {
      innerValue: this.value
    }
  },
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
      this.$emit('ok', this.innerValue)
      this.hide()
    }
  },
  computed: {
    editType () {
      return `Edit${this.type}`
    }
  }
}
</script>
