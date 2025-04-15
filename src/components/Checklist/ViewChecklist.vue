<template>
  <div>
    <q-card-section class="content" :style="contentStyle">
      <slot name="top-toolbar-left"></slot>
      <p class="q-pa-sm text-h6 checklist-title">{{ value.value.title }}</p>
      <slot name="top-toolbar-right"></slot>
      <q-list dense>
        <q-item dense v-for="item in uncheckedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-item-section side class="checklist-side">
            <q-checkbox :model-value="!!item.value.selected" @update:model-value="onChecked(item)" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ item.value.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="checked-separator" v-if="checkedItems.length && uncheckedItems.length && !this.$q.platform.is.desktop" />
        <q-item v-if="checkedItems.length && !this.$q.platform.is.desktop" class="checklist-item">
          <q-item-section side class="checklist-side">
            <q-icon name="check_box" class="q-px-xs" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ completedItemsLabel }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item v-model="checkedExpanded" v-if="checkedItems.length && this.$q.platform.is.desktop" @click.stop="onToggle" dense-toggle switch-toggle-side expand-separator class="q-pa-none" :label="completedItemsLabel">
          <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id">
            <q-item-section side class="checklist-side">
              <q-checkbox v-model="item.value.checked" @update:model-value="onUnChecked(item)" :label="item.value.label" size="xs" color="grey-7" class="checked-item" />
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <!-- <q-item dense v-for="item in checkedItems" :key="item._id" :_id="item._id" class="checklist-item">
          <q-item-section side class="checklist-side">
            <q-checkbox v-model="item.value.checked" @update:model-value="onUnChecked(item)" size="xs" color="grey-7" class="checked-item" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="checked-item">
              {{ item.value.label }}
            </q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
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
import { extend } from 'quasar'
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
    draggable: {
      default: false
    }
  },
  data () {
    return {
      checkedExpanded: false
    }
  },
  emits: ['change'],
  methods: {
    onToggle () {},
    onChecked (val, evt) {
      val.value.selected = true
      const that = this
      setTimeout(function () {
        val.value.checked = true
        that.$emit('change', that.value)
      }, 500)
    },
    onUnChecked (val, evt) {
      val.value.selected = false
      val.value.checked = false
      this.$emit('change', this.value)
    },
    deleteCheckedItems (e) {
      e.stopPropagation()
      const val = extend({}, this.value)
      val.value.items = val.value.items.filter(item => !item.value.checked)
      this.$emit('change', this.value)
    }
  },
  computed: {
    uncheckedItems () {
      return this.value.value.items.filter(item => !item.value.checked)
    },
    checkedItems () {
      return this.value.value.items.filter(item => item.value.checked)
    },
    completedItemsLabel () {
      return `${this.checkedItems.length} checked items`
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
    overflow-wrap: break-word
  .checklist-item
    padding: 0
    .checklist-side
      padding: 0
  .checked-separator
    margin: 5px 0
.active-buttons
  padding: 0
</style>
