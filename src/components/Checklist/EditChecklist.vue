<template>
  <div>
    <q-card-section>
      <q-input borderless v-model="title" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section>
      <q-list dense ref="ChecklistItems">
        <draggable>
          <edit-checklist-item v-for="item in items" :key="item._id" :_id="item._id" v-model="item.value" @delete="deleteItem" />
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
    _id: {
      required: true
    },
    value: {
      default: {
        title: null,
        items: []
      }
    }
  },
  data () {
    return {
      items: this.value.items || [],
      title: this.value.title,
      newItem: ''
    }
  },
  methods: {
    createNewItem () {
      this.items.push({
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
      this.items = this.items.filter(item => item._id !== id)
    },
    onChange () {
      this.$emit('input', {
        value: {
          title: this.title,
          items: this.items
        },
        type: 'Checklist',
        _id: this._id
      })
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function () {
        this.onChange()
      }
    }
  }
}
</script>
