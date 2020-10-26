<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :color="$q.dark.isActive ? 'dark' : ''"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-input standout :dark="!$q.dark.isActive" dense class="search q-ml-md on-left" placeholder="Search..." input-class="text-right" debounce="500" v-model="search">
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
        <q-space />

        <q-btn flat dense unelevated :ripple="false" @click="darkMode = !darkMode">
          <img v-if="$q.dark.isActive" src="~/assets/tinylist-dark.svg" class="logo" alt="tinylist" />
          <img v-else src="~/assets/tinylist-white.svg" class="logo" alt="tinylist" />
          <q-tooltip>Toggle Dark Mode</q-tooltip>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="sidebar"
    >
      <q-list class="sidebar-menu">
        <q-item clickable @click="support">
          <q-item-section avatar>
            <q-icon name="stars" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Support tinylist
            </q-item-label>
            <q-item-label caption>
              Hosting isn't cheap. Contributions are appreciated!
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="linkUuid">
          <q-item-section avatar>
            <q-icon name="phonelink" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Link a Device</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="$q.platform.is.mobile && $q.platform.is.ios" clickable @click="showHomescreenInstructions">
          <q-item-section avatar>
            <q-icon name="add_to_home_screen" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Install on Your Device</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-expansion-item icon="settings" label="Settings" group="settings">
          <q-list dense>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="darkMode" />
              </q-item-section>
            </q-item>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Display Style</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn-toggle flat v-model="displayMode" :options="[{value: 'grid', slot: 'grid'},{value:'list', slot: 'list'}]">
                  <template v-slot:grid>
                    <q-icon name="view_module" />
                    <q-tooltip>Grid</q-tooltip>
                  </template>
                  <template v-slot:list>
                    <q-icon name="view_stream" />
                    <q-tooltip>List</q-tooltip>
                  </template>
                </q-btn-toggle>
              </q-item-section>
            </q-item>
            <q-expansion-item icon="admin_panel_settings" label="Advanced Settings" caption="Here there be dragons">
              <q-card>
                <q-card-section>
                  <q-input dense readonly :value="this.uuid" label="My Unique ID" @click="editUuid" />
                  <q-input dense readonly :value="this.dbUrl" label="Remote Database" @click="editDbUrl" />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-expansion-item>
        <q-separator />
        <q-item dense clickable @click="bugReport">
          <q-item-section avatar>
            <q-icon name="bug_report" />
          </q-item-section>
          <q-item-section>
            <q-item-label>File a Bug Report</q-item-label>
          </q-item-section>
        </q-item>
        <q-item dense clickable @click="redditCommunity">
          <q-item-section avatar>
            <q-icon v-if="$q.dark.isActive" name="tl:reddit-dark" />
            <q-icon v-else name="tl:reddit-light" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reddit Community</q-item-label>
            <q-item-label caption>/r/tinylist for updates, discussion</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="terms-links">
        <q-btn flat dense :to="{ name: 'intro' }">Introduction</q-btn><br><q-btn flat dense :to="{ name: 'terms' }">Terms of Service</q-btn> | <q-btn flat dense :to="{ name: 'privacy'}">Privacy Policy</q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view :uuid="uuid" :dbUrl="dbUrl" :search="search" :display-mode="displayMode" @created="createdDoc" @share="share" @clearsearch="search=null" />
    </q-page-container>
  </q-layout>
</template>

<script>
import ChangeUuidDialog from '../components/ChangeUuidDialog'
import ChangeDburlDialog from '../components/ChangeDburlDialog'
import QRCodeDialog from '../components/QRCodeDialog'
import IosHomescreenDialog from '../components/IosHomescreenDialog'
import { copyToClipboard } from 'quasar'

const additionalIcons = {
  'tl:reddit-light': 'img:/icons/reddit-light.svg',
  'tl:reddit-dark': 'img:/icons/reddit-dark.svg'
}

export default {
  name: 'MainLayout',
  components: {},
  data () {
    return {
      leftDrawerOpen: false,
      createdFirst: false,
      uuid: localStorage.getItem('uuid'),
      dbUrl: localStorage.getItem('dbUrl'),
      displayMode: localStorage.getItem('displaymode') || 'grid',
      search: null
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
              id: 'qrcode',
              icon: 'qr_code_2',
              label: 'Scan a code'
            },
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
            case 'qrcode':
              this.$q.dialog({
                component: QRCodeDialog,
                parent: this,
                code: opts.url,
                msg: 'Scan this code with your device to link them and sync your data.'
              })
              break
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
    },
    support () {
      window.open('https://ko-fi.com/tinylist')
    },
    redditCommunity () {
      window.open('https://www.reddit.com/r/tinylist')
    },
    showHomescreenInstructions () {
      if (this.$q.platform.is.ios) {
        this.$q.dialog({
          component: IosHomescreenDialog,
          parent: this
        })
      }
      if (this.$q.platform.is.android) {

      }
    }
  },
  computed: {
    darkMode: {
      get () {
        return this.$q.dark.isActive
      },
      set (val) {
        this.$q.dark.set(!!val)
        localStorage.setItem('darkmode', this.$q.dark.isActive)
      }
    }
  },
  watch: {
    displayMode (val) {
      localStorage.setItem('displaymode', val)
    }
  },
  created () {
    this.createdFirst = localStorage.getItem('createdFirst')

    const darkMode = localStorage.getItem('darkmode')
    if (darkMode !== null && typeof darkMode !== 'undefined') {
      this.darkMode = JSON.parse(darkMode)
    }

    const displayMode = localStorage.getItem('displaymode')
    if (displayMode !== null && typeof displayMode !== 'undefined') {
      this.displayMode = displayMode
    }

    // map custom icons into the set as defined at the top
    this.$q.iconMapFn = (iconName) => {
      const icon = additionalIcons[iconName]
      if (typeof icon !== 'undefined') {
        return { icon: icon }
      }
    }
  },
  mounted () {
    if (!this.uuid) {
      this.$router.replace({ name: 'get-started' })
    }
    if (!this.dbUrl) {
      this.dbUrl = process.env.DB_URL ? `${process.env.DB_URL}:${process.env.DB_PORT || 5984}` : 'https://db.tinylist.app:6984'
    }
  }
}
</script>

<style lang="sass" scoped>
  .logo
    height: 40px
  .search
    min-width: 30%
  .sidebar
    position: relative
    .sidebar-menu
      height: calc(100vh - 5em)
      overflow: scroll
  .terms-links
    position: absolute
    bottom: 5px
    text-align: center
    width: 100%
</style>
