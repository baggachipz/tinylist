<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-advanced-settings">
      <q-card-section>
        <q-banner class="bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          Only change your unique key if you want to have the same data as another device. You will lose all current data on this device. Only change this if you know what you're doing!
        </q-banner>

        <q-input borderless v-model="val" label="My Unique ID" />

      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancel" @click="onCancelClick" />
        <q-btn :color="$q.dark.isActive ? '' : 'primary'" :text-color="$q.dark.isActive ? 'primary' : ''" label="Save" @click="onSaveClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
      val: this.value
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onSaveClick () {
      this.$emit('ok', this.val)
      this.hide()
    },
    onCancelClick () {
      this.hide()
    }
  }

}
</script>
