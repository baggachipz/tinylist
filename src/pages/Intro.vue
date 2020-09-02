<template>
  <q-layout class="page">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row justify-center">
          <div class="col col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center">
            <img src="~/assets/tinylist-yellow.svg" class="logo" alt="tinylist" />
          </div>
        </div>
        <div class="row justify-center">
          <div class="col col-md-10">
            <h2 :class="headerClass">Create and share notes and checklists, without sacrificing your privacy.</h2>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col col-md-9">
            <h5><strong>tinylist</strong> is different from other note-taking apps:</h5>

            <q-list class="text-grey-9 text-body1">
              <div class="row items-center">
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="do_not_touch" />
                    </q-item-section>
                    <q-item-section>No advertisement or tracking</q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sports_bar" />
                    </q-item-section>
                    <q-item-section>Free to use and open source</q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="how_to_reg" />
                    </q-item-section>
                    <q-item-section>Does not require any registration</q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="devices" />
                    </q-item-section>
                    <q-item-section>Usable on any modern internet-connected device (but works offline!)</q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="mobile_friendly" />
                    </q-item-section>
                    <q-item-section>Also installs as an app on your phone or tablet</q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="lock" />
                    </q-item-section>
                    <q-item-section>Secure and anonymous</q-item-section>
                  </q-item>
                </div>
              </div>
            </q-list>
          </div>
        </div>

        <div class="row q-pa-lg justify-center">
          <q-btn size="lg" label="Get Started" color="secondary" icon="login" :to="{ name: 'get-started' }" />
        </div>

        <div class="row justify-center">
          <div class="col col-md-9">
            <h3>How does tinylist work?</h3>
            <h4>Unique keys protect your data</h4>
            <p>The first time you click "get started", a universally unique key is created and assigned to your device. All notes and checklists you create are tied to this key. This key is used to sync your data with a <a href="https://couchdb.apache.org/" target="_blank">database</a>. If you use that key on another device (through the "Link a Device" function), that same key is used for your data. Without knowing this unique key, nobody else can see or edit your data.</p>
            <h4>What about when I share a note or checklist?</h4>
            <p>When you share a note or checklist, a new unique database is created for this shared item, and a link to that item is put in your database. That way, you can share only the documents you want while maintaining your private information.</p>
            <h4>Do you log my access and activity?</h4>
            <p>No, nothing is logged except the data you create and is therefore synced to the database. tinylist makes no use of a web server; all activity takes place in the browser and data is sent to the database.</p>
            <h4>Can I use my own database?</h4>
            <p>Absolutely. If you wish to use your own <a href="https://couchdb.apache.org/" target="_blank">CouchDB-compliant database</a>, modify the database address in the sidebar's Advanced Settings area.</p>
            <h4>Do you encrypt all data?</h4>
            <p>All data is encrypted during transport (via https). Data is not encrypted at-rest in the database (localy or remotely). However, access to that data is not possible without knowing your personal unique key. Sharing of documents with friends or across devices would be prohibitively difficult if all data was encrypted, so this design decision was made. Your information remains secure, available, and convenient using this method.</p>
          </div>
        </div>

        <q-page-sticky position="top-right" v-if="this.$q.platform.is.desktop">
          <a href="https://github.com/baggachipz/tinylist"><img loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_gray_6d6d6d.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'Intro',
  computed: {
    headerClass () {
      return `text-center${this.$q.screen.name === 'xs' ? ' text-h4' : ''}`
    }
  }
}
</script>
<style lang="stylus" scoped>
  .page
    background: $amber-1
  .logo
    width: 90%
</style>
