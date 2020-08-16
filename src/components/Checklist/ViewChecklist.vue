<template>
  <div>
    <q-card-section class="content" :style="contentStyle">
      <p class="q-px-sm text-h6">{{ value.value.title }}</p>
      <q-list dense>
        <q-item dense v-for="item in uncheckedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" @input="onInput(item)" size="xs" />
        </q-item>
        <q-separator v-if="checkedItems.length && uncheckedItems.length" />
        <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" @input="onInput(item)" size="xs" color="grey-7" class="checked-item" />
        </q-item>
      </q-list>
      <div class="clipped" v-if="clipped">&mldr;</div>
    </q-card-section>
    <q-card-actions v-if="active" class="active-buttons">
      <slot name="bottom-toolbar"></slot>
      <q-btn dense flat round icon="delete_sweep" @click.prevent="deleteCheckedItems" v-if="active && checkedItems.length">
        <q-tooltip>Delete checked items</q-tooltip>
      </q-btn>
    </q-card-actions>
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
    },
    active: {
      default: false
    },
    contentStyle: {
      default: ''
    },
    clipped: {
      default: false
    }
  },
  methods: {
    onInput (val, evt) {
      this.$emit('change', this.value)
    },
    deleteCheckedItems (e) {
      e.stopPropagation()
      this.value.value.items = this.value.value.items.filter(item => !item.value.checked)
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
  .content
    padding: 0
    position: relative
    .checklist-item
      padding: 0
    .clipped
      position: absolute
      width: 100%
      bottom: 0
      height: 2.1em
      padding-top: 1em
      font-weight: 900
      font-size: 1.5em
      padding-left: 3px
      color: $grey
      background: linear-gradient(rgba(255,255,255,0), 20%, rgba(255,255,255,1))
</style>
