<template>
  <q-item v-if="!checked" dense @mouseenter="active=true" @mouseleave="active=false" class="q-pa-none">
    <q-item-section side>
      <div class="side-icons">
        <q-icon dense name="drag_indicator" size="sm" :class="active ? 'handle drag-active' : 'handle drag-inactive'" />
        <q-checkbox :value="selected" dense size="sm" @input="changeChecked" class="on-right" />
      </div>
    </q-item-section>
    <q-item-section>
      <q-input borderless dense autogrow size="xs" :value="label" placeholder="List item" @input="changeLabel" debounce="800" @keydown.enter.stop="enterPressed" @keydown.delete="deletePressed" class="q-pa-none" input-class="q-pa-none" ref="input" hide-bottom-space />
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
    value: {}
  },
  data () {
    return {
      label: '',
      checked: false,
      deleted: false,
      active: false,
      selected: false
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    appendLabel (val) {
      this.label += val
      this.onChange()
    },
    changeLabel (val) {
      this.label = val
      this.onChange()
    },
    changeChecked (val) {
      this.selected = val
      setTimeout(() => {
        this.checked = val
        this.onChange()
      }, 500)
    },
    setCursor (idx) {
      if (idx < 0) {
        idx = this.label.length + idx
      }
      this.$refs.input.$refs.input.selectionStart = this.$refs.input.$refs.input.selectionEnd = idx
    },
    onChange () {
      this.$emit('input', {
        label: this.label,
        checked: this.checked,
        deleted: this.deleted
      })
    },
    enterPressed (e) {
      const start = e.target.selectionStart, end = e.target.selectionEnd
      if (end > 0) {
        const beginStr = this.label.slice(0, start)
        const endStr = this.label.slice(end)
        this.changeLabel(beginStr.replace(/\r?\n|\r/, ''))
        this.$emit('enter-pressed', { id: this._id, val: endStr })
      }
      e.preventDefault()
    },
    deletePressed (e) {
      const start = e.target.selectionStart, end = e.target.selectionEnd
      if (start === 0 && end === 0) {
        const endStr = this.label ? this.label.slice(end) : ''
        this.$emit('delete-pressed', { id: this._id, val: endStr })
        this.deleteItem()
        e.preventDefault()
      }
    },
    deleteItem () {
      this.$emit('delete', this._id)
    }
  },
  created () {
    this.label = this.value.label
    this.checked = !!this.value.checked
    this.deleted = !!this.value.deleted
  },
  watch: {
    value: {
      handler: function () {
        this.label = this.value.label
        this.checked = this.value.checked
        this.deleted = this.value.deleted
        this.selected = this.value.checked
      },
      deep: true
    }
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
