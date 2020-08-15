<template>
  <q-card dense bordered class="q-pa-xs" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-bind:is="viewType" v-model="value" @change="onChange" :active="active" ref="view" :content-style="contentStyle" :clipped="clipped">
      <template v-slot:bottom-toolbar>
        <q-btn dense flat round icon="delete" @click="deleteItem" v-if="active">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
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
  props: ['value'],
  data () {
    return {
      active: false,
      maxHeight: 300,
      clipped: false
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
    },
    isClipped () {
      this.clipped = this.$refs.view.$el.offsetHeight >= this.maxHeight
    },
    onResize () {
      console.log('resize')
    }
  },
  computed: {
    viewType () {
      return `View${this.value.type}`
    },
    contentStyle () {
      return `overflow: hidden; max-height: ${this.maxHeight}px;`
    }
  },
  mounted () {
    this.isClipped()
  },
  watch: {
    value () {
      this.isClipped()
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
