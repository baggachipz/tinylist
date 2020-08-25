<template>
  <q-card dense bordered :class="cardClass" :flat="!active" @mouseover="active=true" @mouseleave="active=false" @click="onClick">
    <component v-if="value.type" v-bind:is="viewType" v-model="value" @change="onChange" :active="active" ref="view" :content-style="contentStyle" :clipped="clipped">
      <template v-slot:bottom-toolbar-left>
        <div class="active-buttons">
          <q-btn dense flat round icon="delete" @click="deleteItem" v-if="active">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:bottom-toolbar-right>
        <div class="active-buttons">
          <q-btn v-if="!value.new" flat round icon="share" @click.prevent="shareItem">
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
    shareItem (e) {
      this.$emit('share', this.value)
      e.stopPropagation()
    },
    onChange (id) {
      this.$emit('change', id)
    },
    onClick () {
      this.$emit('click')
    },
    isClipped () {
      this.clipped = this.$refs.view && this.$refs.view.$el.offsetHeight >= this.maxHeight
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
    },
    cardClass () {
      return this.value.share ? 'shared q-pa-xs' : 'q-pa-xs'
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
  .shared
    background: $amber-1
</style>
