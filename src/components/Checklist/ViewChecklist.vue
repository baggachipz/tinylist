<template>
  <div>
    <q-card-section>
      <p class="text-h6">{{ value.value.title }}</p>
      <q-list dense>
        <q-item dense v-for="item in uncheckedItems" :key="item._id" :_id="item._id">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" @input="onInput(item)" size="xs" />
        </q-item>
        <q-separator v-if="checkedItems.length && uncheckedItems.length" />
        <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" @input="onInput(item)" size="xs" color="grey-7" class="checked-item" />
        </q-item>
      </q-list>
    </q-card-section>
  </div>
</template>
<script>
export default {
  name: 'ViewChecklist',
  props: {
    value: {
      default: {
        title: null,
        items: []
      }
    }
  },
  methods: {
    onInput (val, evt) {
      this.$emit('change', this.value._id)
    }
  },
  computed: {
    uncheckedItems () {
      return this.value.value.items.filter(item => !item.value.checked)
    },
    checkedItems () {
      return this.value.value.items.filter(item => item.value.checked)
    }
  }
}
</script>

<style lang="sass" scoped>
  .checked-item
    color: $grey-7
    text-decoration: line-through
</style>
