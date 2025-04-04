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
            <q-btn dense flat round icon="archive" @click="archiveItem" v-if="!val.new && !isArchiveItem">
            <q-tooltip>Archive</q-tooltip>
          </q-btn>
          <folder-selector :folders="folders" :current-folder="modelValue.folder" @move="folderItem" v-if="!val.new" />
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
import FolderSelector from './FolderSelector'
import { throttle } from 'quasar'

export default {
  name: 'EditDialog',
  components: { EditChecklist, EditNote, FolderSelector },
  props: {
    modelValue: {},
    folders: {
      default: () => []
    }
  },
  data () {
    return {
      val: this.modelValue
    }
  },
  emits: ['ok', 'hide', 'update:model-value', 'cancel', 'moveToFolder'],
  methods: {
    show () {
      // required by name for QDialog plugin
      this.$refs.dialog.show()
    },
    async hide (ok) {
      // required by name for QDialog plugin
      await this.$refs.dialog.hide()
      if (ok) {
        this.$emit('update:model-value', this.val)
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
      this.$emit('update:model-value', this.val)
    },
    pinItem (e) {
      this.$set(this.val, 'pinned', !this.val.pinned)
      this.emitVal()
      e.stopPropagation()
    },
    deleteItem () {
      this.$parent.$parent.deleteItem(this.val._id)
      this.hide()
    },
    shareItem () {
      this.$parent.$parent.onShare(this.val)
      this.hide()
    },
    folderItem (folder) {
      this.$emit('moveToFolder', this.modelValue, folder)
      this.hide()
    },
    archiveItem (e) {
      this.folderItem(String.fromCharCode(0) + 'Archive')
      this.hide()
      e.stopPropagation()
    }
  },
  computed: {
    editType () {
      return this.modelValue && this.modelValue.type ? `Edit${this.modelValue.type}` : null
    },
    isArchiveItem () {
      return this.modelValue?.folder === String.fromCharCode(0) + 'Archive'
    }
  },
  watch: {
    modelValue: {
      handler () {
        this.val = this.modelValue
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
