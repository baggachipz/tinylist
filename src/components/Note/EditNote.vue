<template>
  <div>
    <q-card-section class="section">
      <q-input borderless v-model="value.value.title" @input="onChange" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section class="section input-area">
      <q-input borderless v-model="value.value.data" @input="onChange" placeholder="Begin typing..." debounce="500" autofocus autogrow />
    </q-card-section>
    <q-card-actions>
      <slot name="bottom-toolbar-left"></slot>
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
export default {
  name: 'EditNote',
  props: {
    value: {
      _id: {
        required: true
      },
      _rev: {
        required: true
      }
    }
  },
  methods: {
    hasData () {
      return this.value && this.value.value && ((this.value.value.title && this.value.value.title.length) || (this.value.value.data && this.value.value.data.length))
    },
    onChange () {
      this.$emit('change', this.value)
    }
  },
  created () {
    if (!this.value.value) {
      this.$set(this.value, 'value', {
        title: null
      })
    }
  }
}
</script>
<style lang="sass" scoped>
  .section
    padding-top: 0
    padding-bottom: 0
  .input-area
    max-height: calc(100vh - 220px);
    overflow: auto
</style>
