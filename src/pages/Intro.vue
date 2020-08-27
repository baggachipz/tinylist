<template>
  <q-layout class="page">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row justify-center">
          <div class="col col-sm-6 col-md-4 col-lg-3 col-xl-2">
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
