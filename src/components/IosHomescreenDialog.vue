<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-ios-homescreen">
      <q-card-section>
        <p>To provide a native app-like experience, you can add tinylist to your iOS homescreen.</p>
        <p>Click <img src="~assets/ios-share-icon.png" alt="Share" /> to show the Sharing menu. Choose "Add to Home Screen":</p>
        <p class="text-center"><img src="~assets/ios-home-screen.jpg" alt="Add to Home Screen" /></p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'IosHomescreenDialog',
  emits: ['ok', 'hide'],
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
      this.$emit('ok')
      this.hide()
    }
  }
}
</script>
