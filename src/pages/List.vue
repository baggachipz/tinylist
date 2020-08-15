<template>
  <q-page class="q-pa-md">

    <draggable v-model="items" class="items-list scroll-y column" @change="reindexItems" ref="viewport" v-bind:style="{ height: viewportHeight }">
      <div v-for="item in items" :key="item._id" class="items-list-item">
        <grid-item :value="item" @delete="deleteItem" @delete-checked="deleteCheckedItems" @change="onEdited" @click="editItem(item)" />
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
import { uid } from 'quasar'
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
      items: [],
      viewportHeight: '1000px'
    }
  },
  methods: {
    async loadItems () {
      const result = await this.db.find({
        selector: {
          type: { $exists: true },
          sort: { $exists: true }
        },
        sort: ['sort']
      })

      this.items = result.docs
      return this.items
    },
    createNew (type) {
      const component = this
      component.$q.dialog({
        component: EditDialog,
        parent: this,
        value: {
          _id: uid(),
          type: type
        }
      }).onOk(component.onCreated)
    },
    editItem (item) {
      const component = this
      component.$q.dialog({
        component: EditDialog,
        parent: this,
        value: item
      }).onOk(component.onEdited)
        .onCancel(() => {
          this.deleteItem(item._id)
        })
    },
    async onCreated (item) {
      // add item to the front of the list
      item.sort = 0
      this.items.unshift(item)
      await this.db.put(item)
      await this.loadItems()
    },
    async onEdited (doc) {
      const item = this.items.find(item => item._id === doc._id)
      if (item) {
        await this.db.put(item)
        this.loadItems()
      }
    },
    async deleteItem (id) {
      const doc = this.items.find(item => item._id === id)
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
    initDbSync () {
      if (this.db && this.dbUrl) {
        this.db.sync(`${this.dbUrl}/${this.uuid}`, {
          live: true,
          retry: true
        }).on('active', () => {
          this.$emit('sync', 'active')
        }).on('change', () => {
          this.loadItems()
          this.$emit('sync', 'done')
        }).on('error', (e) => {
          console.error(e)
          this.$emit('sync', 'error')
        }).on('pause', () => {
          this.$emit('sync', 'done')
        }).on('complete', () => {
          this.loadItems()
          this.$emit('sync', 'done')
        })
      } else {
        console.log('did not start sync')
      }
    },
    resizeViewport () {
      const heights = new Array(this.numberOfColumns).fill(0)
      this.$refs.viewport.$children.forEach((child, idx) => {
        const height = getComputedStyle(child.$el).getPropertyValue('height')
        heights[idx % this.numberOfColumns] += (parseFloat(height) + 20)
      })
      this.viewportHeight = Math.max(...heights) + 50 + 'px'
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
    this.loadItems()
  },
  updated () {
    this.resizeViewport()
  },
  watch: {
    dbUrl: function () {
      this.initDbSync()
    },
    uuid: function () {
      console.debug('uuid changed')
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
