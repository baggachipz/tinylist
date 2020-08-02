<template>
  <q-page class="q-pa-md">
    <q-btn-dropdown color="primary" label="Create new ...">
      <q-list>
        <q-item clickable v-close-popup @click="createNew('Checklist')">
          <q-item-section side>
            <q-icon name="fact_check" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Checklist</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <draggable v-model="items" class="items-list items-list--3 column" @change="reindexItems">
      <div v-for="item in items" :key="item._id" class="items-list-item">
        <grid-item :value="item" @delete="deleteItem" @change="onEdited" @click="editItem(item)" />
      </div>
    </draggable>

    <q-btn label="debug data" @click="debugData" />
  </q-page>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'
import GridItem from '../components/GridItem'
import EditDialog from '../components/EditDialog'

PouchDB.plugin(PouchDBFind)

export default {
  name: 'PageIndex',
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
      items: []
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
          type: type,
          _id: uuidv4()
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
    },
    async onCreated (item) {
      // add item to the front of the list
      item.sort = 0
      this.items.unshift(item)
      await this.db.put(item)
      await this.loadItems()
      this.reindexItems()
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
    async reindexItems () {
      // bulk-insert the documents after updating their sort properties
      await this.db.bulkDocs(this.items.map((doc, idx) => {
        doc.sort = idx
        return doc
      }))
    },
    async debugData () {
      console.debug(await this.db.find({ selector: {} }))
    }
  },
  computed: {},
  mounted () {
    this.db = new PouchDB(this.uuid)
    if (this.dbUrl) this.db.sync(this.dbUrl)
    this.db.createIndex({
      index: {
        fields: ['sort']
      }
    })
    this.loadItems()
  }
}
</script>

<style lang="sass" scoped>

  // Masonry layout
  .items-list
    flex-direction: column
    height: 700px
    &--2
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
    &--3
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

    .items-list-item
      width: 33.33%
      padding: 5px

</style>
