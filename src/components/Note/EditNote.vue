<template>
  <div>
    <q-card-section class="section">
      <slot name="top-toolbar-left"></slot>
      <q-input borderless v-model="title" @update:model-value="onChange" class="text-h6" placeholder="Title" />
      <slot name="top-toolbar-right"></slot>
    </q-card-section>
    <q-card-section class="section input-area">
      <q-input borderless v-model="text" @update:model-value="onChange" placeholder="Begin typing..." autofocus autogrow />
    </q-card-section>
    <q-card-actions>
      <slot name="bottom-toolbar-left"></slot>
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
import { extend } from 'quasar'
export default {
  name: 'EditNote',
  props: {
    value: {
      _id: {
        required: true
      },
      _rev: {
        required: true
      },
      value: {
        default: {
          title: null,
          data: null
        }
      }
    }
  },
  data () {
    return {
      title: this.value.value ? this.value.value.title : null,
      text: this.value.value ? this.value.value.data : null
    }
  },
  methods: {
    hasData () {
      return ((this.title && this.title.length) || (this.text && this.text.length))
    },
    onChange () {
      const val = extend(true, this.value, {
        value: {
          title: this.title,
          data: this.text
        }
      })
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="sass" scoped>
  .section
    padding-top: 0
    padding-bottom: 0
  .input-area
    max-height: calc(100vh - 220px)
    overflow: auto
</style>
