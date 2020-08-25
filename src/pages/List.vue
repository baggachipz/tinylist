<template>
  <q-page class="q-pa-md">

    <draggable v-model="items" class="items-list scroll-y column" @change="reindexItems" ref="viewport" v-bind:style="{ height: viewportHeight }">
      <div v-for="(item, idx) in gridItems" :key="idx" class="items-list-item">
        <grid-item :value="item" @delete="deleteItem" @delete-checked="deleteCheckedItems" @change="onEdited" @click="editItem(item)" @share="onShare" />
      </div>
    </draggable>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab icon="edit" color="primary" direction="up" vertical-actions-align="right">
        <q-fab-action label-position="left" icon="sticky_note_2" label="Note" @click="createNew('Note')" />
        <q-fab-action label-position="left" icon="fact_check" label="Checklist" @click="createNew('Checklist')" />
      </q-fab>
    </q-page-sticky>

  </q-page>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { uid, extend } from 'quasar'
import draggable from 'vuedraggable'
import GridItem from '../components/GridItem'
import EditDialog from '../components/EditDialog'

PouchDB.plugin(PouchDBFind)

export default {
  name: 'List',
  components: {
    GridItem,
    draggable
  },
  props: {
    uuid: {
      required: true
    },
    dbUrl: {
      default: false
    }
  },
  data () {
    return {
      db: null,
      shareDbs: {},
      items: [],
      sharedItems: {},
      viewportHeight: '1000px'
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
      const dbUrl = this.dbUrl
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
            shareDbs[item.value].replicate.from(`${dbUrl}/${item.value}`).on('complete', async () => {
              const doc = await shareDbs[item.value].get(item.value)
              $set(sharedItems, item.value, doc)
              initDbSync(shareDbs[item.value], item.value)
            })
          } else {
            // grab item from the shared db
            const doc = await shareDbs[item.value].get(item.value)
            $set(sharedItems, item.value, doc)
          }
        }
      })

      this.resizeViewport()
      return this.items
    },
    createNew (type) {
      // for use in scope below
      const component = this

      component.$q.dialog({
        component: EditDialog,
        parent: this,
        value: {
          _id: uid(),
          type: type,
          new: true
        }
      }).onOk(component.onCreated)
    },
    editItem (item) {
      // for use in scope below
      const component = this

      component.$q.dialog({
        component: EditDialog,
        parent: this,
        value: item
      }).onOk(component.onEdited)
    },
    async onCreated (item) {
      // add item to the front of the list
      item.sort = 0

      // remove 'new' flag since it's not new anymore
      delete item.new

      // put item into list in first position
      this.items.unshift(item)

      // save to db
      await this.db.put(item)

      // refresh list
      await this.loadItems()
    },
    async onEdited (doc) {
      if (doc.share) {
        delete doc.share
        await this.shareDbs[doc._id].put(doc)
      } else {
        const item = this.items.find(item => item._id === doc._id)
        if (item) {
          await this.db.put(item)
        }
      }

      this.loadItems()
    },
    async deleteItem (id) {
      const doc = this.items.find(item => item._id === id || (item.type === 'Share' && item.value === id))
      if (doc) {
        await this.db.remove(doc)
        this.loadItems()
      }
    },
    async deleteCheckedItems (id) {
      const doc = this.items.find(item => item._id === id)
      if (doc && doc.type === 'Checklist' && doc.value.items && Array.isArray(doc.value.items)) {
        doc.value.items = doc.value.items.filter(item => !item.value.checked)
        await this.db.put(doc)
        this.loadItems()
      }
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
            uuid: shareId
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

        // set the creator for use later
        shareItem.creator = this.uuid

        // convert the existing item into one of type 'Share' and store the share id
        item.type = 'Share'
        item.value = shareId

        // create the new database for the share
        this.shareDbs[shareId] = new PouchDB(shareId)

        // store the new item in the new shared db
        await this.shareDbs[shareId].put(shareItem)

        // push the new shared db up to the server
        this.shareDbs[shareId].replicate.to(`${this.dbUrl}/${shareId}`).on('complete', function () {
          // initiate the sync (after the first replication to save on http calls)
          this.initDbSync(this.shareDbs[shareId], shareId)
        })

        // store the shared-type item
        await this.db.put(item)

        return shareId
      } else {
        // share has already been created, return the shared id
        return item.value
      }
    },
    initDbSync (db, id) {
      if (!db) db = this.db
      if (!id) id = this.uuid

      if (db && this.dbUrl) {
        db.sync(`${this.dbUrl}/${id}`, {
          live: true,
          retry: true
        }).on('change', this.loadItems)
      } else {
        throw new Error(`could not start sync for id: ${id}`)
      }
    },
    resizeViewport () {
      // create a heights array, the length of which matches the number of columns
      const heights = new Array(this.numberOfColumns).fill(0)

      // iterate through each of the items in the viewport
      this.$refs.viewport.$children.forEach((child, idx) => {
        // get the height of that item and add it to the 'column' height
        const height = getComputedStyle(child.$el).getPropertyValue('height')
        heights[idx % this.numberOfColumns] += (parseFloat(height) + 20)
      })

      // set the height to the tallest column hight, plus a little extra padding for good measure
      this.viewportHeight = Math.max(...heights) + 100 + 'px'
    }
  },
  computed: {
    numberOfColumns () {
      switch (this.$q.screen.name) {
        case 'xs':
          return 2
        case 'sm':
        case 'md':
          return 3
        case 'lg':
        case 'xl':
          return 4
        default:
          return 3
      }
    },
    gridItems () {
      // get local reference handle for use in the callback below
      const sharedItems = this.sharedItems

      // if a shared item, return the shared doc from the db; otherwise, just return the item
      return this.items.map(item => {
        const doc = sharedItems[item.value] || {}
        return item.type === 'Share' ? Object.assign(doc, { share: true }) : item
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
    this.loadItems()
    this.db.replicate.from(`${this.dbUrl}/${this.uuid}`).on('complete', async () => {
      this.initDbSync()
      this.loadItems()
    })
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
      this.db.replicate.from(`${this.dbUrl}/${this.uuid}`).on('complete', () => {
        this.loadItems()
        this.initDbSync()
      })
    }
  }
}
</script>

<style lang="sass" scoped>

  // Masonry layout
  .items-list-item
    padding: 5px

  .items-list
    flex-flow: column wrap
    height: 1000px

  .items-list
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

    @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
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

    @media (min-width: $breakpoint-lg-min)
      > div
        &:nth-child(3n + 1)
          order: 1
        &:nth-child(3n + 2)
          order: 2
        &:nth-child(3n + 3)
          order: 3
        &:nth-child(3n)
          order: 4

      &:before,
      &:after
        content: ''
        flex: 1 0 100% !important
        width: 0 !important
        order: 3

    .items-list-item
      @media (max-width: $breakpoint-xs-max)
        width: 50%
      @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
        width: 33.33%
      @media (min-width: $breakpoint-lg-min)
        width: 25%

  .quick-entry-form
    margin: 0 auto
    @media (max-width: $breakpoint-sm-max)
      width: 66%
    @media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max)
      width: 33%
    @media (min-width: $breakpoint-lg-min)
      width: 25%

</style>
