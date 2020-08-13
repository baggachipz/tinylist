<template>
  <div>
    <q-card-section class="content">
      <p class="text-h6">{{ value.value.title }}</p>
      <pre>{{ value.value.data }}</pre>
    </q-card-section>
    <q-card-actions v-if="active" class="active-buttons">
      <slot name="bottom-toolbar"></slot>
    </q-card-actions>
  </div>
</template>
<script>
export default {
  name: 'ViewNote',
  props: ['value', 'active']
}
</script>
<style lang="sass" scoped>
  pre
    font-family: "Roboto"
  .content
    padding: 3px
    pre
      overflow-x: auto;
      white-space: pre-wrap;
      white-space: -moz-pre-wrap;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      word-wrap: break-word;
</style>
