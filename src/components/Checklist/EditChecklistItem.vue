<template>
  <q-item dense>
    <q-item-section side>
      <q-icon dense name="drag_indicator" />
    </q-item-section>
    <q-item-section side>
      <q-checkbox :value="checked" dense @input="changeChecked" />
    </q-item-section>
    <q-item-label>
      <q-input borderless dense autogrow :value="label" placeholder="List item" debounce="500" @input="changeLabel" ref="input" />
    </q-item-label>
    <q-item-section side>
      <q-btn flat round dense icon="clear" @click="deleteItem" />
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
      deleted: false
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
