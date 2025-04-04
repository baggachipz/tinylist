<template>
  <q-item v-if="!checked" dense @mouseenter="active=true" @mouseleave="active=false" class="q-pa-none">
    <q-item-section side>
      <div class="side-icons">
        <q-icon dense name="drag_indicator" size="sm" :class="active ? 'handle drag-active' : 'handle drag-inactive'" />
        <q-checkbox :model-value="selected" dense size="sm" @update:model-value="changeChecked" class="on-right" />
      </div>
    </q-item-section>
    <q-item-section>
      <q-input borderless dense autogrow size="xs" :model-value="label" placeholder="List item" @update:model-value="changeLabel" @keydown.enter.stop="enterPressed" @keydown.delete="deletePressed" class="q-pa-none" input-class="q-pa-none" ref="input" hide-bottom-space />
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
    modelValue: {}
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
      const idx = this.label.length
      this.label += val
      this.onChange()
      this.$nextTick(function () {
        this.setCursor(idx)
      })
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
      this.$emit('update:model-value', {
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
        this.onChange()
        this.$emit('enter-pressed', { id: this._id, val: endStr })
      }
      e.preventDefault()
    },
    deletePressed (e) {
      const start = e.target.selectionStart, end = e.target.selectionEnd
      if (start === 0) {
        const endStr = this.label ? this.label.slice(end) : ''
        // delete the item if there is no text in it
        if (end === 0) this.deleteItem()
        this.$nextTick(function () {
          this.$emit('delete-pressed', { id: this._id, val: endStr })
        })
        e.preventDefault()
      }
    },
    deleteItem () {
      this.$emit('delete', this._id)
    }
  },
  created () {
    this.label = this.modelValue.label
    this.checked = !!this.modelValue.checked
    this.deleted = !!this.modelValue.deleted
  },
  watch: {
    modelValue: {
      handler: function () {
        this.label = this.modelValue.label
        this.checked = this.modelValue.checked
        this.deleted = this.modelValue.deleted
        this.selected = this.modelValue.checked
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
