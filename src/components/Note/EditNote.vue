<template>
  <div>
    <q-card-section>
      <q-input borderless v-model="value.value.title" class="text-h6" placeholder="Title" debounce="500" />
    </q-card-section>
    <q-card-section>
      <q-input borderless v-model="value.value.data" placeholder="Begin typing..." debounce="500" autofocus autogrow />
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
      }
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
