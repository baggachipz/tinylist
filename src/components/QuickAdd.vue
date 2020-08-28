<template>
  <q-card>
    <q-card-section class="q-py-xs">
      <q-input dense autofocus borderless placeholder="Start a note..." debounce="800" v-model="value" ref="quickadd">
        <template v-slot:append>
          <q-btn flat round icon="sticky_note_2" @click="create('Note')">
            <q-tooltip>New Note</q-tooltip>
          </q-btn>
          <q-btn flat round icon="fact_check" @click="create('Checklist')">
            <q-tooltip>New Checklist</q-tooltip>
          </q-btn>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: 'QuickAdd',
  data () {
    return {
      value: ''
    }
  },
  methods: {
    create (type) {
      this.$emit('input', type)
    }
  },
  watch: {
    value (val) {
      if (val && val.length) {
        this.$emit('input', 'Note', { data: val })
        this.value = ''
      }
    }
  }
}
</script>
