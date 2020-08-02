<template>
  <div>
    <q-card-section>
      <q-input borderless v-model="value.value.title" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section>
      <q-list dense ref="ChecklistItems">
        <draggable>
          <edit-checklist-item v-for="item in value.value.items" :key="item._id" :_id="item._id" v-model="item.value" @delete="deleteItem" />
        </draggable>
      </q-list>
      <q-item>
        <q-item-section side>
          <q-btn flat round dense icon="add" @click="createNewItem" />
          <q-icon name="plus" />
        </q-item-section>
        <q-item-label>
          <q-input borderless dense v-model="newItem" deboune="500" placeholder="List item" @keyup.enter="createNewItem" />
        </q-item-label>
      </q-item>
    </q-card-section>
    <q-card-actions>
      <slot name="bottom-toolbar"></slot>
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
      default: {
        title: null,
        items: []
      }
    }
  },
  data () {
    return {
      newItem: ''
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
    }
  }
}
</script>
