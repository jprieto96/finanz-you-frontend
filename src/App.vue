<template>
  <div id="app">
    <Header/>
    <div id="main_container">
      <div class="view_container">
        <router-view class="views"/>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');

body {
  margin: 0;
}

#app {
  font-family: 'Open Sans', sans-serif;
  text-align: center;
}

#main_container {
  display: flex;
}

.view_container {
  width: 100%;
  height: auto;
  margin-right: 5em;
  margin-left: 5em;
  margin-top: 7em;
  margin-bottom: 5em;
}

.views {
  min-height: calc(100vh - 156px);
}


</style>
