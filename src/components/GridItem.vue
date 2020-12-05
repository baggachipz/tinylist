<template>
  <q-card dense bordered :class="cardClass" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-if="value.type" v-bind:is="viewType" :value="value" @change="onChange" :active="active" :draggable="draggable" ref="view">
      <template v-slot:bottom-toolbar-left>
        <div class="active-buttons">
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
    }
  }
}
</script>
