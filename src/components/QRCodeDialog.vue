<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card>
      <q-card-section v-if="title || msg">
        <div class="text-h6" v-if="title">{{ title }}</div>
        <p v-if="msg">{{ msg }}</p>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <div class="qrcode" v-html="qrcode" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :color="$q.dark.isActive ? '' : 'primary'" :text-color="$q.dark.isActive ? 'primary' : ''" label="Done" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import QRCode from 'qrcode-svg'
export default {
  name: 'QRCodeDialog',
  props: ['code', 'msg', 'title'],
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
    },
    onCancelClick () {
      this.hide()
    }
  },
  computed: {
    qrcode () {
      return new QRCode({
        content: this.code,
        join: true,
        container: 'svg-viewbox'
      }).svg()
    }
  }
}
</script>
<style lang="sass" scoped>
  .qrcode
    max-height: 50%
</style>
