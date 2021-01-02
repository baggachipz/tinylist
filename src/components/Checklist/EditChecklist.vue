<template>
  <div>
    <q-card-section class="section">
      <q-input borderless v-model="title" class="text-h6" @input="onChange" placeholder="Title" />
    </q-card-section>
    <q-card-section class="section input-area">
      <q-list dense ref="ChecklistItems">
        <draggable v-model="uncheckedItems" @change="onOrderChange" handle=".handle">
          <edit-checklist-item v-for="(item, idx) in uncheckedItems" :key="idx" :_id="item._id" v-model="item.value" @input="onChange" @delete="deleteItem" @enter-pressed="insertNewItemAfter" @delete-pressed="appendToItemBefore" />
        </draggable>
      </q-list>
      <q-item dense class="q-pa-none">
        <q-item-section side>
          <div class="side-icons">
            <q-btn flat round dense icon="add" size="sm" @click="createNewItem()" />
            <q-checkbox dense size="sm" :value="false" class="on-right" disabled />
          </div>
        </q-item-section>
        <q-item-section>
          <q-input v-model="newItem" borderless dense deboune="500" size="sm" placeholder="List item" @keyup.enter="createNewItem" :autofocus="$q.platform.is.desktop" />
        </q-item-section>
      </q-item>
      <q-expansion-item v-model="checkedExpanded" v-if="checkedItems.length" dense-toggle switch-toggle-side expand-separator icon="check_box" class="q-pa-none" :label="completedItemsLabel">
        <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id">
          <q-checkbox v-model="item.value.checked" @input="onUnChecked(item)" :label="item.value.label" size="xs" color="grey-7" class="checked-item" />
        </q-item>
      </q-expansion-item>
    </q-card-section>
    <q-card-actions>
      <slot name="bottom-toolbar-left"></slot>
      <q-btn flat round icon="delete_sweep" class="action-button" @click="deleteCheckedItems" v-if="checkedItems.length">
        <q-tooltip>Delete checked items</q-tooltip>
      </q-btn>
      <q-btn flat round icon="sort" class="action-button" @click="toggleSort" v-if="uncheckedItems">
        <q-tooltip>Sort (ascending, descending)</q-tooltip>
      </q-btn>
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import EditChecklistItem from './EditChecklistItem'
import { uid, extend } from 'quasar'
export default {
  name: 'EditChecklist',
  components: { draggable, EditChecklistItem },
  props: {
    value: {
      _id: {
        required: true
      },
      _rev: {
        required: true
      },
      value: {
        default: {
          title: null,
          items: []
        }
      }
    }
  },
  data () {
    return {
      title: this.value.value ? this.value.value.title : null,
      items: this.value.value ? this.value.value.items : [],
      newItem: '',
      checkedExpanded: false,
      sort: null
    }
  },
  methods: {
    createNewItem (idx, val) {
      if (!val) {
        if (this.newItem && this.newItem.trim().length) {
          val = this.newItem.slice()
          this.newItem = ''
        }
      }

      const newItem = {
        _id: uid(),
        value: {
          label: val,
          checked: false,
          deleted: false
        }
      }
      if (idx >= 0) {
        this.items.splice(idx, 0, newItem)
      } else {
        this.items.push(newItem)
      }
      this.onChange()
      return newItem
    },
    insertNewItemAfter (args) {
      const idx = this.getItemIndex(args.id) + 1
      const item = this.createNewItem(idx, args.val)
      this.$nextTick(function () {
        const newIdx = this.getItemIndex(item._id)
        const component = this.$refs.ChecklistItems.$children[0].$children[newIdx]
        if (component) {
          component.focus()
          component.setCursor(0)
        }
      })
    },
    appendToItemBefore (args) {
      const idx = this.getItemIndex(args.id) - 1
      if (idx >= 0) {
        const item = this.$refs.ChecklistItems.$children[0].$children[idx]
        if (item) {
          item.focus()
          if (args.val) {
            item.appendLabel(args.val)
          }
        }
      }
      this.onChange()
    },
    getItemIndex (id) {
      return this.items.findIndex(item => item._id === id)
    },
    deleteItem (id) {
      this.items = this.items.filter(item => item._id !== id)
      this.onChange()
    },
    deleteCheckedItems () {
      this.items = this.items.filter(item => !item.value.checked)
      this.onChange()
    },
    hasData () {
      return ((this.title && this.title.length) || (this.items && this.items.length) || (this.newItem && this.newItem.length))
    },
    toggleSort () {
      const sorts = ['asc', 'desc']
      this.sort = sorts[(sorts.indexOf(this.sort) + 1) % sorts.length]
      this.items = this.sortItems()
      this.onChange()
    },
    sortItems () {
      switch (this.sort) {
        case 'asc':
          return this.items.sort((a, b) => {
            const aVal = a.value.label.toLowerCase(), bVal = b.value.label.toLowerCase()
            if (aVal === bVal) return 0
            return aVal > bVal ? 1 : -1
          })
        case 'desc':
          return this.items.sort((a, b) => {
            const aVal = a.value.label.toLowerCase(), bVal = b.value.label.toLowerCase()
            if (aVal === bVal) return 0
            return aVal < bVal ? 1 : -1
          })
        case 'id':
          return this.items.sort((a, b) => a._id - b._id)
        default:
          return this.items
      }
    },
    onUnChecked (item) {
      item.selected = false
      this.onChange()
    },
    onChange () {
      const val = extend({}, this.value, {
        value: {
          title: this.title,
          items: this.items
        }
      })
      this.$emit('change', val)
    },
    onOrderChange (action) {
      if (action.moved) {
        this.onChange()
      }
    }
  },
  computed: {
    uncheckedItems: {
      get: function () {
        return this.items.filter(item => !item.value.checked)
      },
      set: function (val) {
        this.items = val.concat(this.checkedItems)
      }
    },
    checkedItems () {
      return this.items.filter(item => item.value.checked)
    },
    completedItemsLabel () {
      return `${this.checkedItems.length} checked items`
    }
  },
  beforeDestroy () {
    if (this.newItem && this.newItem.length) {
      this.createNewItem()
    }
  }
}
</script>
<style lang="sass" scoped>
  .section
    padding-top: 0
    padding-bottom: 0
  .input-area
    max-height: calc(100vh - 220px);
    overflow: auto
  .side-icons
    display: inline-block
  .checked-item
    color: $grey-7
    text-decoration: line-through
</style>
