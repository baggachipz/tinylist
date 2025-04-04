<template>
  <q-btn dense flat round icon="folder" @click="onSelectFolderClick">
    <q-menu @hide="notSelecting">
      <q-list dense>
        <q-item v-for="(folder, idx) in displayFolders" :key="idx" clickable v-close-popup @click="move(folder)">
          <q-item-section>
            <q-item-label>{{ folder || '(No Folder)' }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input dense borderless v-model="newFolderName" placeholder="New Folder..." @keydown.enter="addNewFolder" />
          </q-item-section>
          <q-item-section side>
            <q-btn dense compact flat icon="add_circle_outline" @click="addNewFolder">
              <q-tooltip>Add</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-tooltip ref="folder-tooltip">Move to Folder</q-tooltip>
  </q-btn>
</template>
<script>

export default {
  name: 'FolderSelector',
  props: {
    folders: {
      default: []
    },
    currentFolder: undefined
  },
  emits: ['move', 'not-selecting', 'selecting'],
  data () {
    return {
      newFolderName: ''
    }
  },
  methods: {
    move (folder) {
      this.$emit('move', folder)
    },
    notSelecting (e) {
      this.$emit('not-selecting')
      e.stopPropagation()
    },
    onSelectFolderClick (e) {
      this.$emit('selecting')
      this.$refs['folder-tooltip'].hide()
      e.stopPropagation()
    },
    addNewFolder (e) {
      this.move(this.newFolderName)
      this.newFolderName = ''
      this.$emit('not-selecting')
      e.stopPropagation()
    }
  },
  computed: {
    displayFolders () {
      return this.folders.filter(folder => (folder !== this.currentFolder) && (folder !== String.fromCharCode(0) + 'Archive'))
    }
  }
}
</script>
