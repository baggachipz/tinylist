<template>
  <q-card dense bordered :class="cardClass" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-if="value.type" v-bind:is="viewType" :value="value" @change="onChange" :active="active" :draggable="draggable" ref="view" class="griditem">
      <template v-slot:top-toolbar-left>
        <q-icon v-if="value.share" name="group" class="text-grey-5 shared-icon" size="xs"><q-tooltip>Shared {{ value.type }}</q-tooltip></q-icon>
      </template>
      <template v-slot:top-toolbar-right>
        <q-icon v-if="$q.platform.is.mobile && draggable" class="handle text-grey-5" name="drag_indicator" size="xs" dense />
        <div v-else>
          <q-btn round flat size="sm" :icon="value.pinned ? 'push_pin' : 'o_push_pin'" class="pin-button" @click="pinItem" v-if="active">
            <q-tooltip v-if="value.pinned">Unpin</q-tooltip>
            <q-tooltip v-else>Pin</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:bottom-toolbar-left>
        <div class="active-buttons">
          <q-btn dense flat round icon="archive" @click="archiveItem" v-if="active && !isArchiveItem">
            <q-tooltip>Archive</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon="delete" @click="deleteItem" v-if="active">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:bottom-toolbar-right>
        <div class="active-buttons">
          <q-btn v-if="!value.new && active" flat round dense icon="share" @click.prevent="shareItem">
            <q-tooltip>Share</q-tooltip>
          </q-btn>
        </div>
      </template>
    </component>
  </q-card>
</template>
<script>
import ViewChecklist from './Checklist/ViewChecklist'
import ViewNote from './Note/ViewNote'
export default {
  name: 'GridItem',
  components: { ViewChecklist, ViewNote },
  props: {
    value: {
      required: true
    },
    draggable: {
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    deleteItem (e) {
      this.$emit('delete', this.value._id)
      e.stopPropagation()
    },
    shareItem (e) {
      this.$emit('share', this.value)
      e.stopPropagation()
    },
    folderItem (e, folder) {
      this.$emit('moveToFolder', this.value, folder)
      e.stopPropagation()
    },
    archiveItem (e) {
      this.folderItem(e, String.fromCharCode(0) + 'Archive')
    },
    pinItem (e) {
      this.$emit('pin', this.value)
      e.stopPropagation()
    },
    onChange (id) {
      this.$emit('change', id)
    },
    onClick () {
      this.$emit('click')
    }
  },
  computed: {
    viewType () {
      return `View${this.value.type}`
    },
    cardClass () {
      return this.value.share ? 'shared q-pa-xs' : 'q-pa-xs'
    },
    isArchiveItem () {
      return this.value?.folder === String.fromCharCode(0) + 'Archive'
    }
  }
}
</script>
<style lang="sass" scoped>
  .content
    .shared-icon
      position: absolute
      top: -3px
      left: -1px
    .handle
      position: absolute
      top: -3px
      right: -5px
    .pin-button
      position: absolute
      top: 0
      right: 0
  .griditem
    overflow-wrap: break-word
</style>
