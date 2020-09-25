<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat to="/" icon="home" label="Home" />

        <q-space />

        <img src="~/assets/tinylist-white.svg" class="logo" alt="tinylist" />

      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :uuid="uuid" :dbUrl="dbUrl" :search="search" @created="createdDoc" @share="share" @clearsearch="search=null" />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'PageLayout'
}
</script>
<style lang="sass" scoped>
  .logo
    height: 40px

  .body--dark
    a
      color $white
</style>
