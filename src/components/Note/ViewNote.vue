<template>
  <div>
    <q-card-section class="content" :style="contentStyle">
      <p class="q-px-sm text-h6">{{ value.value.title }}</p>
      <pre>{{ value.value.data }}</pre>
      <div class="clipped" v-if="clipped">&mldr;</div>
    </q-card-section>
    <q-card-actions v-if="active" class="active-buttons">
      <slot name="bottom-toolbar"></slot>
    </q-card-actions>
  </div>
</template>
<script>
export default {
  name: 'ViewNote',
  props: ['value', 'active', 'contentStyle', 'clipped']
}
</script>
<style lang="sass" scoped>
  .content
    padding: 0
    position: relative
    pre
      padding: 0 8px
      font-family: "Roboto"
      overflow-x: auto;
      white-space: pre-wrap;
      white-space: -moz-pre-wrap;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      word-wrap: break-word;
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
