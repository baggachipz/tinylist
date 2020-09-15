<template>
  <div>
    <q-card-section class="section">
      <q-input borderless v-model="value.value.title" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section class="section input-area">
      <q-list dense ref="ChecklistItems">
        <draggable v-model="uncheckedItems" handle=".handle">
          <edit-checklist-item v-for="item in uncheckedItems" :key="item._id" :_id="item._id" v-model="item.value" :set-focus="item.setFocus" @delete="deleteItem" @enter-pressed="insertNewItemAfter" />
        </draggable>
      </q-list>
      <q-item dense class="q-pa-none">
        <q-item-section side>
          <div class="side-icons">
            <q-btn flat round dense icon="add" size="sm" @click="createNewItem" />
            <q-checkbox dense size="sm" :value="false" class="on-right" disabled />
          </div>
        </q-item-section>
        <q-item-section>
          <q-input v-model="newItem" borderless dense deboune="500" size="sm" placeholder="List item" @keyup.enter="createNewItem" :autofocus="$q.platform.is.desktop" />
        </q-item-section>
      </q-item>
      <q-expansion-item v-model="checkedExpanded" v-if="checkedItems.length" dense-toggle switch-toggle-side expand-separator icon="check_box" class="q-pa-none" :label="completedItemsLabel">
        <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" size="xs" color="grey-7" class="checked-item" />
        </q-item>
      </q-expansion-item>
    </q-card-section>
    <q-card-actions>
      <slot name="bottom-toolbar-left"></slot>
      <q-btn flat round icon="delete_sweep" class="action-button" @click="deleteCheckedItems" v-if="checkedItems.length" tooltip="Delete checked items">
        <q-tooltip>Delete checked items</q-tooltip>
      </q-btn>
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import EditChecklistItem from './EditChecklistItem'
import { uid } from 'quasar'
export default {
  name: 'EditChecklist',
  components: { draggable, EditChecklistItem },
  props: {
    value: {
      _id: {
        required: true
      }
    }
  },
  data () {
    return {
      newItem: '',
      checkedExpanded: false
    }
  },
  methods: {
    createNewItem (idx) {
      if (this.newItem && this.newItem.trim().length) {
        const newItem = {
          _id: uid(),
          value: {
            label: this.newItem,
            checked: false,
            deleted: false
          }
        }
        if (idx >= 0) {
          newItem.setFocus = true
          this.value.value.items.splice(idx, 0, newItem)
        } else {
          this.value.value.items.push(newItem)
        }
        this.newItem = ''
      }
    },
    insertNewItemAfter (id) {
      this.newItem = ''
      const idx = this.value.value.items.findIndex(item => item._id === id)
      this.createNewItem(idx + 1)
    },
    deleteItem (id) {
      this.value.value.items = this.value.value.items.filter(item => item._id !== id)
    },
    deleteCheckedItems () {
      this.value.value.items = this.value.value.items.filter(item => !item.value.checked)
      this.$emit('change', this.value)
    },
    hasData () {
      return this.value && this.value.value && ((this.value.value.title && this.value.value.title.length) || (this.value.value.items && this.value.value.items.length) || (this.newItem && this.newItem.length))
    }
  },
  computed: {
    uncheckedItems: {
      get: function () {
        return this.value.value.items.filter(item => !item.value.checked)
      },
      set: function (val) {
        this.$set(this.value.value, 'items', val.concat(this.checkedItems))
      }
    },
    checkedItems () {
      return this.value.value.items.filter(item => item.value.checked)
    },
    completedItemsLabel () {
      return `${this.checkedItems.length} checked items`
    }
  },
  created () {
    if (!this.value.value) {
      this.$set(this.value, 'value', {
        title: null,
        items: []
      })
    }
  }
}
</script>
<style lang="sass" scoped>
  .section
    padding-top: 0
    padding-bottom: 0
  .input-area
    max-height: calc(100vh - 200px);
    overflow: auto
  .side-icons
    display: inline-block
  .checked-item
    color: $grey-7
    text-decoration: line-through
  .action-button
    color: $grey-7
    &:hover
      color: black

</style>
