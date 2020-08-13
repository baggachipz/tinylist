<template>
  <div>
    <q-card-section class="content">
      <p class="text-h6">{{ value.value.title }}</p>
      <pre>{{ value.value.data }}</pre>
    </q-card-section>
  </div>
</template>
<script>
export default {
  name: 'ViewNote',
  props: ['value']
}
</script>
<style lang="sass" scoped>
  pre
    font-family: "Roboto"
</style>
