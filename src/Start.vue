<template>
  <q-layout>
    <q-page-container>
      <q-page class="msg-bg">
        <div class="row">
          <div class="col msg text-body1"><p><q-spinner-ball size="3em" /></p><p>Creating your database....</p></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { uid } from 'quasar'
import { createDatabase } from './utils'
export default {
  name: 'Start',
  props: ['uuid'],
  async mounted () {
    if (this.uuid) {
      localStorage.setItem('uuid', this.uuid)
      const route = this.$router.resolve({ name: 'list' })
      window.location = route.href
    } else {
      if (!localStorage.getItem('uuid')) {
        const id = 'tl' + uid()
        try {
          await createDatabase(id)
          localStorage.setItem('uuid', id)
          const route = this.$router.resolve({ name: 'list' })
          window.location = route.href
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  .msg-bg
    background: $amber-1
  .msg
    color: $grey-7
    font-size: 2em
    text-align: center
    position: absolute
    top: 50%
    left: 50%
    -ms-transform: translateX(-50%) translateY(-50%)
    -webkit-transform: translate(-50%,-50%)
    transform: translate(-50%,-50%)
</style>
