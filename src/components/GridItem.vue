<template>
  <q-card dense bordered class="q-pa-xs" :flat="!active" @mouseover="active=true" @mouseout="active=false">
    <component v-bind:is="viewType" v-model="innerValue" />
    <div class="test">
      <q-btn dense flat round icon="delete" @click="deleteItem" />
    </div>
  </q-card>
</template>
<script>
import ViewChecklist from './Checklist/ViewChecklist'
export default {
  name: 'GridItem',
  components: { ViewChecklist },
  props: ['value', 'type', '_id', '_rev'],
  data () {
    return {
      innerValue: this.value,
      active: false
    }
  },
  methods: {
    deleteItem () {
      this.$emit('delete', this._id)
    },
    onInput (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    viewType () {
      return `View${this.type}`
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler () {
        this.$emit('input', {
          _id: this._id,
          _rev: this._rev,
          value: this.innerValue
        })
      }
    }
  }
}
</script>
