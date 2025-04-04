<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-import-data">
      <q-card-section>
        <p>Click below to upload your export file, either from a tinylist export or Keep data from <a href="https://takeout.google.com" target="_blank">Google Takeout</a>:</p>
        <q-file outlined v-model="importFile" ref="importFile" label="Import File" accept=".zip,.json,.txt,application/zip,application/json,text/plain" @update:model-value="importError = false" @rejected="onRejected" :error="importError" error-message="Please select a supported file type.">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancel" @click="onCancelClick" />
        <q-btn :color="$q.dark.isActive ? '' : 'primary'" label="Import" @click="onOKClick" :disabled="!importFile || importError" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ImportDataDialog',
  data () {
    return {
      importFile: null,
      importError: false
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
    onOKClick () {
      if (this.importFile) {
        this.$emit('ok', this.importFile)
      }
      this.hide()
    },
    onCancelClick () {
      this.hide()
    },
    onRejected () {
      this.importError = true
      this.importFile = null
    }
  }
}
</script>
