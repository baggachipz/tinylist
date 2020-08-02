<template>
  <q-card dense bordered class="q-pa-xs" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-bind:is="viewType" v-model="value" @change="onChange" :active="active">
      <template v-slot:bottom-toolbar>
        <q-btn dense flat round icon="delete" @click="deleteItem" v-if="active" />
      </template>
    </component>
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
    deleteItem (e) {
      this.$emit('delete', this.value._id)
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
    }
  }
}
</script>
<style lang="sass" scoped>
  .active-buttons
    color: $grey-7
    button
      &:hover
        color: black
</style>
