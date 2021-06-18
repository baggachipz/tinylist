<template>
  <div>
    <q-card-section class="content">
      <slot name="top-toolbar-left"></slot>
      <p class="q-pa-sm text-h6 note-title">{{ value.value.title }}</p>
      <slot name="top-toolbar-right"></slot>
    </q-card-section>
    <q-card-section class="content" :style="contentStyle">
      <div v-html="content" class="markdown" />
    </q-card-section>
    <q-card-actions v-if="this.$q.platform.is.desktop" class="active-buttons">
      <slot name="bottom-toolbar-left"></slot>
      <q-btn flat disabled class="invisible" />
      <q-space />
      <slot name="bottom-toolbar-right"></slot>
    </q-card-actions>
  </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
export default {
  name: 'ViewNote',
  props: ['value', 'active', 'contentStyle', 'clipped', 'draggable'],
  computed: {
    content () {
      const md = new MarkdownIt({ linkify: true })
      return md.render(this.value.value.data)
    }
  }
}
</script>
<style lang="sass" scoped>
  .content
    padding: 0
    position: relative
    .note-title
      margin: 0
      overflow-wrap: break-word
    .markdown
      padding: 0 8px
      overflow: scroll-auto
    .shared-icon
      position: absolute
      top: -3px
      left: -1px
    .handle
      position: absolute
      top: -3px
      right: -5px
  .active-buttons
    padding: 0
</style>
