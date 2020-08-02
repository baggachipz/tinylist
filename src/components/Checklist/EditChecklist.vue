<template>
  <div>
    <q-card-section>
      <q-input borderless v-model="value.value.title" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section>
      <q-list dense ref="ChecklistItems">
        <draggable>
          <edit-checklist-item v-for="item in uncheckedItems" :key="item._id" :_id="item._id" v-model="item.value" @delete="deleteItem" />
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
          <q-input borderless dense v-model="newItem" deboune="500" size="sm" placeholder="List item" @keyup.enter="createNewItem" />
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
      <q-btn flat round icon="delete_sweep" class="action-button" @click="deleteCheckedItems" v-if="checkedItems.length" tooltip="Delete checked items" />
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import EditChecklistItem from './EditChecklistItem'
import { v4 as uuidv4 } from 'uuid'
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
    createNewItem () {
      this.value.value.items.push({
        _id: uuidv4(),
        value: {
          label: this.newItem,
          checked: false,
          deleted: false
        }
      })
      this.newItem = ''
    },
    deleteItem (id) {
      this.value.value.items = this.value.value.items.filter(item => item._id !== id)
    },
    deleteCheckedItems () {
      this.value.value.items = this.value.value.items.filter(item => !item.value.checked)
    }
  },
  computed: {
    uncheckedItems () {
      return this.value.value.items.filter(item => !item.value.checked)
    },
    checkedItems () {
      return this.value.value.items.filter(item => item.value.checked)
    },
    completedItemsLabel () {
      return `${this.checkedItems.length} Completed items`
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
