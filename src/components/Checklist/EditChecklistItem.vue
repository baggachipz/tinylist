<template>
  <q-item dense @mouseenter="active=true" @mouseleave="active=false" class="q-pa-none">
    <q-item-section side>
      <div class="side-icons">
        <q-icon dense name="drag_indicator" size="sm" :class="active ? 'drag-active' : 'drag-inactive'" />
        <q-checkbox :value="checked" dense size="sm" @input="changeChecked" class="on-right" />
      </div>
    </q-item-section>
    <q-item-section>
      <q-input borderless dense size="xs" :value="label" placeholder="List item" @input="changeLabel" @keyup.enter="enterPressed" class="q-pa-none" input-class="q-pa-none" ref="input" :autofocus="setFocus" hide-bottom-space />
    </q-item-section>
    <q-item-section side>
      <q-btn flat round dense icon="clear" size="sm" @click="deleteItem" v-if="active" />
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  name: 'EditChecklistItem',
  props: {
    _id: {
      required: true
    },
    value: {},
    setFocus: {
      default: false
    }
  },
  data () {
    return {
      label: '',
      checked: false,
      deleted: false,
      active: false
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    changeLabel (val) {
      this.label = val
      this.onChange()
    },
    changeChecked (val) {
      this.checked = val
      this.onChange()
    },
    onChange () {
      this.$emit('input', {
        label: this.label,
        checked: this.checked,
        deleted: this.deleted
      })
    },
    enterPressed () {
      this.$emit('enter-pressed', this._id)
    },
    deleteItem () {
      this.$emit('delete', this._id)
    }
  },
  created () {
    this.label = this.value.label
    this.checked = !!this.value.checked
    this.deleted = !!this.value.deleted
    this.onChange()
  }
}
</script>
<style lang="sass" scoped>
  .side-icons
    display: inline-block
  .drag-inactive
    float: left
    color: $grey-5
    opacity: 0.5
  .drag-active
    cursor: move
    float: left
    color: $grey-5
    opacity: 1
</style>
