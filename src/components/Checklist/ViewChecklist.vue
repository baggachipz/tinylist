<template>
  <div>
    <q-card-section class="content" :style="contentStyle">
      <q-icon v-if="this.$q.platform.is.mobile && draggable" class="handle text-grey-5" name="drag_indicator" size="xs" dense />
      <q-icon v-if="value.share" name="group" class="text-grey-5 shared-icon" size="xs"><q-tooltip>Shared {{ value.type }}</q-tooltip></q-icon>
      <p class="q-pa-sm text-h6 checklist-title">{{ value.value.title }}</p>
      <q-list dense>
        <q-item dense v-for="item in uncheckedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-item-section side class="checklist-side">
            <q-checkbox v-model="item.value.checked" @input="onInput(item)" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ item.value.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="checked-separator" v-if="checkedItems.length && uncheckedItems.length" />
        <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-item-section side class="checklist-side">
            <q-checkbox v-model="item.value.checked" @input="onInput(item)" size="xs" color="grey-7" class="checked-item" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="checked-item">
              {{ item.value.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="clipped" v-if="clipped">&mldr;</div>
    </q-card-section>
    <q-card-actions v-if="this.$q.platform.is.desktop" class="active-buttons">
      <slot name="bottom-toolbar-left"></slot>
      <div class="active-buttons">
        <q-btn dense flat round icon="delete_sweep" @click.prevent="deleteCheckedItems" v-if="active && checkedItems.length">
          <q-tooltip>Delete checked items</q-tooltip>
        </q-btn>
      </div>
      <q-btn flat disabled class="invisible" />
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
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
    },
    draggable: {
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
      this.$emit('change', this.value)
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
    .checklist-title
      margin: 0
    .checklist-item
      padding: 0
      .checklist-side
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
    .shared-icon
      position: absolute
      top: -3px
      left: -1px
    .handle
      position: absolute
      top: -3px
      right: -5px
    .checked-separator
      margin: 5px 0
  .active-buttons
    padding: 0
  .body--dark
    .content
      .clipped
        background: linear-gradient(rgba(29,29,29,0), 20%, rgba(29,29,29,1))
</style>
