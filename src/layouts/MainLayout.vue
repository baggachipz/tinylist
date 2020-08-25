<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space />

        <img src="~/assets/tinylist.svg" class="logo" alt="tinylist" />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
        </q-item-label>
        <q-item clickable @click="linkUuid">
          <q-item-section avatar>
            <q-icon name="phonelink" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Link a Device</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-expansion-item icon="settings" label="Advanced Settings" caption="Here there be dragons">
          <q-card>
            <q-card-section>
              <q-input dense readonly :value="this.uuid" label="My Unique ID" @click="editUuid" />
              <q-input dense readonly :value="this.dbUrl" label="Remote Database" @click="editDbUrl" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-item clickable @click="bugReport">
          <q-item-section avatar>
            <q-icon name="bug_report" />
          </q-item-section>
          <q-item-section>
            <q-item-label>File a Bug Report</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :uuid="uuid" :dbUrl="dbUrl" @created="createdDoc" @share="share" />
    </q-page-container>
  </q-layout>
</template>

<script>
import ChangeUuidDialog from '../components/ChangeUuidDialog'
import ChangeDburlDialog from '../components/ChangeDburlDialog'
import { copyToClipboard } from 'quasar'

export default {
  name: 'MainLayout',
  components: {},
  data () {
    return {
      leftDrawerOpen: false,
      createdFirst: false,
      uuid: localStorage.getItem('uuid'),
      dbUrl: localStorage.getItem('dbUrl')
    }
  },
  methods: {
    createdDoc (item) {
      if (!this.createdFirst) {
        this.createdFirst = true
        localStorage.setItem('createdFirst', true)
      }
    },
    editUuid () {
      this.$q.dialog({
        component: ChangeUuidDialog,
        parent: this,
        value: this.uuid
      }).onOk(uuid => {
        this.uuid = uuid
        localStorage.setItem('uuid', this.uuid)
      })
    },
    editDbUrl () {
      this.$q.dialog({
        component: ChangeDburlDialog,
        parent: this,
        value: this.dbUrl,
        uuid: this.uuid
      }).onOk(dbUrl => {
        this.dbUrl = dbUrl
        localStorage.setItem('dbUrl', this.dbUrl)
      })
    },
    linkUuid () {
      const link = window.location.origin + this.$router.resolve({
        name: 'linkuuid',
        params: {
          uuid: this.uuid
        }
      }).href
      this.share({
        title: 'Link a Device',
        url: link,
        msg: 'Send a link to your other device(s) via email, text, etc. When you click it, your devices will be in sync.'
      })
    },
    share (opts) {
      if (!opts.url) throw new Error('url parameter is required to share')
      if (!opts.title) throw new Error('title parameter is required to share')
      if (!opts.msg) opts.msg = ''

      if (navigator.share) {
        navigator.share({
          title: opts.title,
          url: opts.url
        })
      } else {
        this.$q.bottomSheet({
          title: opts.title,
          message: opts.msg,
          actions: [
            {
              id: 'copy',
              icon: 'content_copy',
              label: 'Copy to clipboard'
            },
            {
              id: 'email',
              icon: 'mail',
              label: 'Send an email'
            }
          ]
        }).onOk(action => {
          switch (action.id) {
            case 'copy':
              copyToClipboard(opts.url).then(() => {
                this.$q.notify('Copied to clipboard.')
              })
              break
            case 'email':
              window.location.href = `mailto:?subject=${encodeURIComponent(`tinylist: ${opts.title}`)}&body=${encodeURIComponent(opts.url)}`
              break
          }
        })
      }
    },
    bugReport () {
      window.open('https://github.com/baggachipz/tinylist/issues')
    }
  },
  created () {
    this.createdFirst = localStorage.getItem('createdFirst')
  },
  mounted () {
    if (!this.uuid) {
      this.$router.replace({ name: 'get-started' })
    }
    if (!this.dbUrl) {
      // dbUrl = 'https://db.tinylist.app'
      this.dbUrl = 'http://tinylist:password@localhost:5984'
    }
  }
}
</script>

<style lang="sass" scoped>
  .logo
    height: 40px
</style>
