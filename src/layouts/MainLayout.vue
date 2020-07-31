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

        <q-toolbar-title>
          TinyList
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :uuid="uuid" :dbUrl="dbUrl" @created="createdDoc" />
    </q-page-container>
  </q-layout>
</template>

<script>

import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'MainLayout',
  components: {},
  data () {
    return {
      leftDrawerOpen: false,
      createdFirst: false
    }
  },
  methods: {
    createdDoc (item) {
      if (!this.createdFirst) {
        this.createdFirst = true
        localStorage.setItem('createdFirst', true)
      }
    }
  },
  computed: {
    dbUrl () {
      let dbUrl = localStorage.getItem('dbUrl')
      if (!dbUrl) {
        dbUrl = false
        // dbUrl = 'http://localhost:5984/'
      }
      return dbUrl
    },
    uuid () {
      let uuid = localStorage.getItem('uuid')
      if (!uuid) {
        uuid = uuidv4()
        localStorage.setItem('uuid', uuid)
      }
      return uuid
    }
  },
  created () {
    this.createdFirst = localStorage.getItem('createdFirst')
  }
}
</script>
