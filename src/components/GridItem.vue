<template>
  <q-card dense bordered class="q-pa-xs" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-bind:is="viewType" v-model="value" @change="onChange" />
    <q-card-actions v-if="active">
      <q-btn dense flat round icon="delete" @click="deleteItem" v-if="active" />
    </q-card-actions>
  </q-card>
</template>
<script>
import ViewChecklist from './Checklist/ViewChecklist'
export default {
  name: 'GridItem',
  components: { ViewChecklist },
  props: ['value'],
  data () {
    return {
      active: false
    }
  },
  methods: {
    deleteItem () {
      this.$emit('delete', this.value._id)
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
    }
  }
}
</script>
