<template>
  <div>
    <q-card-section>
      <p class="text-h6">{{ value.title }}</p>
      <q-list dense>
        <q-item dense v-for="item in value.items" :key="item._id" :_id="item._id">
          <q-checkbox v-model="item.value.checked" :label="item.value.label" size="sm" />
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
  }
}
</script>
