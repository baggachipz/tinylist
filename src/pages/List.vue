<template>
  <q-page class="q-pa-md">
    <div v-if="searchItems || this.$q.screen.name !== 'xs'" class="top-focus-area q-py-lg">
      <quick-add v-if="this.$q.screen.name !== 'xs' && !searchItems"  @input="createNew" />
      <q-banner v-if="searchItems" inline-actions rounded class="text-positive bg-grey-3">
        <strong>{{ searchItems.length }}</strong> found in search.
        <template v-slot:action>
          <q-btn flat label="Clear Search" @click="clearSearch" />
        </template>
      </q-banner>
    </div>

    <div class="search-results items-grid scroll-y column" v-if="searchItems">
      <div v-for="(item, idx) in searchItems" :key="idx" class="display-item">
        <grid-item :value="item" @delete="deleteItem" @change="onEdited" @click="editItem(item)" @share="onShare" />
      </div>
    </div>

    <draggable v-else v-model="items" :handle="this.$q.platform.is.mobile ? '.handle' : false" :class="'scroll-y column items-' + displayMode" @change="reindexItems" ref="viewport" v-bind:style="{ height: viewportHeight }">
      <div v-for="(item, idx) in displayItems" :key="idx" class="display-item">
        <grid-item :value="item" :draggable="true" @delete="deleteItem" @change="onEdited" @click="editItem(item)" @share="onShare" />
      </div>
    </draggable>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-tooltip :value="showFtueTooltip" :delay="2000" anchor="center left" self="center right">
        Tap the button to get started. <q-icon name="east" />
      </q-tooltip>
      <q-fab icon="edit" color="primary" :text-color="$q.dark.isActive ? 'dark' : ''" direction="up" vertical-actions-align="right" @show="showFtueTooltip = false">
        <q-fab-action color="primary" :text-color="$q.dark.isActive ? 'dark' : ''" label-position="left" icon="sticky_note_2" label="Note" @click="createNew('Note')" />
        <q-fab-action color="primary" :text-color="$q.dark.isActive ? 'dark' : ''" label-position="left" icon="fact_check" label="Checklist" @click="createNew('Checklist')" />
      </q-fab>
    </q-page-sticky>

    <edit-dialog v-model="editingItem" @input="onEdited" ref="editDialog" />

  </q-page>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { uid, extend } from 'quasar'
import draggable from 'vuedraggable'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { createDatabase, ExportItem, ImportItem } from '../utils'
import GridItem from '../components/GridItem'
import EditDialog from '../components/EditDialog'
import QuickAdd from '../components/QuickAdd'
import IosHomescreenDialog from '../components/IosHomescreenDialog'

PouchDB.plugin(PouchDBFind)

export default {
  name: 'List',
  components: {
    GridItem,
    QuickAdd,
    EditDialog,
    draggable
  },
  props: {
    uuid: {
      required: true
    },
    dbUrl: {
      default: false
    },
    search: {
      default: null
    },
    displayMode: {
      default: 'grid'
    }
  },
  data () {
    return {
      db: null,
      shareDbs: {},
      items: [],
      sharedItems: {},
      editingItem: null,
      syncs: {},
      viewportHeight: '1000px',
      showFtueTooltip: false,
      showIosTooltip: false
    }
  },
  methods: {
    async loadItems () {
      // get items from local db
      const result = await this.db.find({
        selector: {
          type: { $exists: true },
          sort: { $exists: true }
        },
        sort: ['sort']
      })

      // get vars for use in scope below
      const shareDbs = this.shareDbs
      const sharedItems = this.sharedItems
      const initDbSync = this.initDbSync
      const $set = this.$set

      // set items from result
      this.items = result.docs

      // iterate through each item
      this.items.forEach(async item => {
        // if item is shared
        if (item.type === 'Share') {
          // if shared db has not been initialized yet for this item
          if (!shareDbs[item.value]) {
            // intialize the shared item db
            shareDbs[item.value] = new PouchDB(item.value)
            initDbSync(shareDbs[item.value], item.value)
          }
          // grab item from the shared db
          const doc = await shareDbs[item.value].get(item.value)
          $set(sharedItems, item.value, doc)
        }
      })

      this.resizeViewport()
      return this.items
    },
    createNew (...args) {
      const [type, val] = args

      // for use in scope below
      const component = this

      component.$q.dialog({
        component: EditDialog,
        parent: this,
        value: {
          _id: uid(),
          type: type,
          value: val,
          new: true,
          created: Date.now(),
          modified: Date.now()
        }
      }).onOk(component.onCreated)
    },
    editItem (item) {
      this.editingItem = item
      this.$refs.editDialog.show()
    },
    async onCreated (item) {
      // add item to the front of the list
      item.sort = 0

      // remove 'new' flag since it's not new anymore
      delete item.new

      // set modified
      item.modified = Date.now()

      // put item into list in first position
      this.items.unshift(item)

      // save to db
      await this.db.put(item)

      // refresh list
      await this.loadItems()
    },
    async onEdited (doc) {
      if (!doc) throw new Error('No document sent to onEdited method.')

      // if a shared item, construct the item to put in the db
      if (doc.share) {
        const item = {
          _id: doc._id,
          _rev: doc._rev,
          created: doc.created,
          modified: Date.now(),
          sort: doc.sort,
          type: doc.type,
          value: doc.value
        }
        const response = await this.shareDbs[doc._id].put(item)
        if (this.editingItem) {
          this.$set(this.editingItem, '_rev', response.rev)
        }
      } else {
        doc.modified = Date.now()
        const response = await this.db.put(doc)
        if (this.editingItem) {
          this.$set(this.editingItem, '_rev', response.rev)
        }
      }

      await this.loadItems()
      this.resizeViewport()
    },
    async deleteItem (id) {
      const doc = this.items.find(item => item._id === id || (item.type === 'Share' && item.value === id))
      if (doc) {
        const response = await this.db.remove(doc)
        // set rev to the newest one so the restore doesn't cause a conflict
        doc._rev = response._rev
        this.loadItems()
        this.$q.notify({
          message: 'Deleted.',
          progress: true,
          actions: [
            { label: 'Undo', handler: () => this.restoreItem(doc) }
          ]
        })
      }
    },
    async restoreItem (doc) {
      await this.db.put(doc)
      await this.loadItems()
    },
    async reindexItems () {
      // bulk-insert the documents after updating their sort properties
      await this.db.bulkDocs(this.items.map((doc, idx) => {
        doc.sort = idx
        return doc
      }))
      this.loadItems()
    },
    async onShare (item) {
      this.$q.dialog({
        title: 'Share',
        message: `Are you sure you want to share this ${item.type}? It will be editable by anbody you share it with.`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const shareId = item.share ? item._id : await this.shareItem(item._id)
        const link = window.location.origin + this.$router.resolve({
          name: 'shareitem',
          params: {
            id: shareId
          }
        }).href
        this.$emit('share', {
          url: link,
          title: 'Share a Note',
          msg: 'Share a note with another person, so you can both edit and collaborate.'
        })
      })
    },
    async shareItem (id) {
      // get the item to share
      const item = this.items.find(item => item._id === id)

      // if it hasn't already been shared
      if (item.type !== 'Share') {
        // generate the id
        const shareId = 'ts' + uid()

        // create the shareable item from the existing item
        const shareItem = extend(true, {}, item, { _id: shareId })

        // get rid of the rev info as that pertains to the other item
        delete shareItem._rev

        // convert the existing item into one of type 'Share' and store the share id
        item.type = 'Share'
        item.value = shareId

        //  make the call to create the db
        await createDatabase(shareId)

        // create the new database for the share
        this.shareDbs[shareId] = new PouchDB(shareId)

        // initiate the sync (after the first replication to save on http calls)
        this.initDbSync(this.shareDbs[shareId], shareId)

        // store the new item in the new shared db
        await this.shareDbs[shareId].put(shareItem)

        // store the shared-type item
        await this.db.put(item)

        this.loadItems()
        return shareId
      } else {
        // share has already been created, return the shared id
        return item.value
      }
    },
    initDbSync (db, id) {
      // if params weren't passed in, use the base-level (top) ones
      if (!db) db = this.db
      if (!id) id = this.uuid

      if (this.syncs[`${this.dbUrl}/${id}`]) {
        this.syncs[`${this.dbUrl}/${id}`].cancel()
        delete this.syncs[`${this.dbUrl}/${id}`]
      }

      if (db && this.dbUrl) {
        this.syncs[`${this.dbUrl}/${id}`] = db.sync(`${this.dbUrl}/${id}`, {
          live: true,
          retry: true,
          back_off_function: (delay) => {
            if (delay === 0) {
              // set initial value to a random one close to 1 sec. Randomize so not every db tries to sync at exactly the same time.
              return 1000 + ((Math.random() - 0.5) * 200)
            }
            // since this isn't the first failed attempt to connect, throttle by 2x the previous value with a max of 10 seconds
            return Math.min(delay * 2, 10000)
          }
        }).on('change', this.loadItems)
      } else {
        throw new Error(`could not start sync for id: ${id}`)
      }
    },
    resizeViewport () {
      // create a heights array, the length of which matches the number of columns
      const heights = new Array(this.numberOfColumns).fill(0)
      const items = this.$refs.viewport && this.$refs.viewport.$children ? this.$refs.viewport.$children : []

      // iterate through each of the items in the viewport
      items.forEach((child, idx) => {
        // get the height of that item and add it to the 'column' height
        const height = getComputedStyle(child.$el).getPropertyValue('height')
        heights[idx % this.numberOfColumns] += (parseFloat(height) + 12)
      })

      // set the height to the tallest column height
      this.viewportHeight = Math.max(...heights) + 'px'
    },
    mapItems (items) {
      // get local reference handle for use in the callback below
      const sharedItems = this.sharedItems

      // if a shared item, return the shared doc from the db; otherwise, just return the item
      return items.map(item => {
        const doc = sharedItems[item.value] || {}
        return item.type === 'Share' ? Object.assign(doc, { share: true }) : item
      })
    },
    clearSearch () {
      this.$emit('clearsearch')
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
    },
    exportAllData () {
      const zip = new JSZip()

      this.displayItems.forEach(item => {
        let name = item.value.title
        const dupeTest = new RegExp(`^${name}(\\(?\\d?\\)?).json`) //eslint-disable-line
        const dupes = zip.filter(path => dupeTest.test(path))
        if (dupes.length) {
          name = `${name}(${dupes.length})`
        }

        zip.file(`${name}.json`, new ExportItem(item).toString())
      })

      zip.generateAsync({ type: 'blob' }).then(blob => {
        saveAs(blob, 'tinylist.zip')
      })
    },
    async importFile (file) {
      try {
        if (file.type === 'application/zip') {
          const zip = await JSZip.loadAsync(file)

          // if a Google Takeout archive, only get files in the 'Keep' folder
          let files = zip.filter(path => {
            return /^Takeout\/Keep\/.*\.json$/.test(path)
          })

          if (!files.length) {
            // must not be a Takeout archive, just do every json file
            files = zip.filter(path => {
              return /.*\.json$/.test(path)
            })
          }

          files.forEach(async item => {
            try {
              await this.importDataItem(await item.async('text'))
            } catch (e) {
              this.$q.notify({
                type: 'negative',
                message: `Unable to import "${item.name}.\n${e.message}`
              })
            }
          })
        } else {
          await this.importDataItem(await file.text())
        }
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: e.message
        })
      }
    },
    async importDataItem (data) {
      const item = JSON.parse(data)
      if (item._id) {
        // get latest _rev to overwrite
        try {
          const existingItem = await this.db.get(item._id)
          item._rev = existingItem._rev
        } catch (e) {
          // do nothing, item doesn't exist in the current db and will be created with this id
        }
      } else {
        item._id = uid()
      }
      await this.onCreated(new ImportItem(item))
    }
  },
  computed: {
    numberOfColumns () {
      if (this.displayMode === 'list') {
        return 1
      }

      switch (this.$q.screen.name) {
        case 'xs':
          return 2
        case 'sm':
        case 'md':
          return 3
        default:
          return 3
      }
    },
    displayItems () {
      return this.mapItems(this.items)
    },
    searchItems () {
      const search = this.search && this.search.length > 2 ? new RegExp(this.search, 'i') : false
      if (!search) return false
      return this.displayItems.filter(item => {
        if (search.test(item.value.title)) return true
        if (item.type === 'Checklist') {
          return item.value.items.some(val => search.test(val.value.label))
        }
        if (item.type === 'Note') {
          return search.test(item.value.data)
        }
      })
    }
  },
  async mounted () {
    this.db = new PouchDB(this.uuid)
    await this.db.createIndex({
      index: {
        fields: ['sort']
      }
    })

    this.initDbSync()
    await this.loadItems()
    this.reindexItems()
    this.showFtueTooltip = this.$q.screen.name === 'xs' && !this.searchItems.length && !this.displayItems.length
    if (this.$q.platform.is.ios) {
      history.pushState({}, null, window.location.origin + this.$router.resolve({
        name: 'linkuuid',
        params: {
          uuid: this.uuid
        }
      }).href)
      if (!this.showFtueTooltip && !localStorage.getItem('seenIosTooltip')) {
        const dismiss = this.$q.notify({
          message: 'Want to install tinylist as an app?',
          color: 'primary',
          textColor: this.$q.dark.isActive ? 'dark' : 'white',
          icon: 'add_to_home_screen',
          position: 'bottom-left',
          timeout: 10000,
          actions: [
            {
              label: 'No Thanks',
              color: this.$q.dark.isActive ? 'dark' : 'white',
              handler: function () {
                localStorage.setItem('seenIosTooltip', true)
                dismiss()
              }
            },
            {
              label: 'Yes!',
              color: this.$q.dark.isActive ? 'dark' : 'white',
              handler: () => {
                localStorage.setItem('seenIosTooltip', true)
                this.showHomescreenInstructions()
                dismiss()
              }
            }
          ]
        })
      }
    }
  },
  updated () {
    this.resizeViewport()
  },
  watch: {
    dbUrl: function () {
      this.initDbSync()
    },
    uuid: function () {
      this.db = new PouchDB(this.uuid)
      this.db.replicate.from(`${this.dbUrl}/${this.uuid}`).on('complete', async () => {
        await this.db.createIndex({
          index: {
            fields: ['sort']
          }
        })
        this.loadItems()
        this.initDbSync()
      }).on('error', (err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="sass" scoped>

  // Masonry (grid) layout
  .items-grid
    flex-flow: column wrap
    overflow-y: visible
    height: 1000px

    @media (max-width: $breakpoint-xs-max)
      > div
        &:nth-child(2n + 1)
          order: 1
        &:nth-child(2n)
          order: 2

      &:before
        content: ''
        flex: 1 0 100% !important
        width: 0 !important
        order: 1

    @media (min-width: $breakpoint-sm-min)
      > div
        &:nth-child(3n + 1)
          order: 1
        &:nth-child(3n + 2)
          order: 2
        &:nth-child(3n)
          order: 3

      &:before,
      &:after
        content: ''
        flex: 1 0 100% !important
        width: 0 !important
        order: 2

    .display-item
      padding: 5px
      @media (max-width: $breakpoint-xs-max)
        width: 50%
      @media (min-width: $breakpoint-sm-min)
        width: 33.33%

  // List layout
  .items-list
    .display-item
      width: 100%
      .q-card
        margin: 5px auto
        @media (max-width: $breakpoint-xs-max)
          width: 100%
        @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
          width: 51%
        @media (min-width: $breakpoint-lg-min)
          width: 800px

  // Other list page features
  .top-focus-area
    margin: 0 auto
    width: 100%
    @media (min-width: $breakpoint-sm-max)
      width: 66%
    @media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max)
      width: 33%
    @media (min-width: $breakpoint-lg-min)
      width: 25%

</style>
