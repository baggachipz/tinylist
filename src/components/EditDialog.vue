<template>
  <q-dialog persistent ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <component v-if="editType" v-bind:is="editType" :value="val" @change="onChange" ref="edit-component">
        <template v-slot:top-toolbar-right>
          <q-btn round flat size="sm" :icon="val.pinned ? 'push_pin' : 'o_push_pin'" class="pin-button" @click="pinItem">
            <q-tooltip v-if="val.pinned">Unpin</q-tooltip>
            <q-tooltip v-else>Pin</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:bottom-toolbar-left>
          <div class="action-buttons">
            <q-btn flat round icon="delete" @click="deleteItem">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </div>
        </template>
        <template v-slot:bottom-toolbar-right>
          <div class="action-buttons">
            <q-btn v-if="!val.new" flat round icon="share" @click.prevent="shareItem">
              <q-tooltip>Share</q-tooltip>
            </q-btn>
          </div>
          <q-btn :color="$q.dark.isActive ? '' : 'primary'" :text-color="$q.dark.isActive ? 'primary' : ''" label="Close" @click="onCloseClick" />
        </template>
      </component>
    </q-card>
  </q-dialog>
</template>
<script>
import EditChecklist from './Checklist/EditChecklist'
import EditNote from './Note/EditNote'
import { throttle } from 'quasar'

export default {
  name: 'EditDialog',
  components: { EditChecklist, EditNote },
  props: ['value'],
  data () {
    return {
      val: this.value
    }
  },
  methods: {
    show () {
      // required by name for QDialog plugin
      this.$refs.dialog.show()
    },
    async hide (ok) {
      // required by name for QDialog plugin
      await this.$refs.dialog.hide()
      if (ok) {
        this.$emit('input', this.val)
        this.$emit('ok', this.val)
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
      this.hide(!this.val.new || this.$refs['edit-component'].hasData())
    },
    onChange (val) {
      this.val = val
      this.emitVal()
    },
    emitVal () {
      this.$emit('input', this.val)
    },
    pinItem (e) {
      this.$emit('pin', this.val)
      e.stopPropagation()
    },
    deleteItem () {
      this.$parent.$parent.deleteItem(this.val._id)
      this.hide()
    },
    shareItem () {
      this.$parent.$parent.onShare(this.val)
      this.hide()
    }
  },
  computed: {
    editType () {
      return this.value && this.value.type ? `Edit${this.value.type}` : null
    }
  },
  watch: {
    value: {
      handler () {
        this.val = this.value
      },
      deep: true
    }
  },
  created () {
    this.emitVal = throttle(this.emitVal, 500)
  }
}
</script>
<style lang="sass" scoped>
  .section
    .pin-button
      position: absolute
      top: 0
      right: 0
</style>
