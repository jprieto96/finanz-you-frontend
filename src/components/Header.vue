<template>
  <header id="menuFijado">
      <!-- Image and text -->
      <b-navbar toggleable="lg" variant="white">
        <b-navbar-brand href="/">
          <a href="/">
            <img href="/" class="logo" src="../assets/logo.png">
          </a>
        </b-navbar-brand>
        <b-navbar-toggle target="navbar-toggle-collapse">
          <template #default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>
        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-navbar-nav class="ml-auto" id="link">
            <b-nav-item id="portal" v-on:click="active" v-if="clientLogged" href="/client">Mi portal</b-nav-item>
            <b-nav-item id="movimientos" v-on:click="active" v-if="clientLogged" href="/client/transactions">Movimientos</b-nav-item>
            <b-nav-item id="portfolio" v-on:click="active" v-if="clientLogged" href="/client/portfolio">Portfolio</b-nav-item>
            <b-nav-item id="login" v-on:click="active" v-if="!clientLogged" href="/login">Iniciar Sesión</b-nav-item>
            <b-nav-item id="perfil" v-on:click="active" v-if="clientLogged" href="/client/perfil"><b-icon id="miPerfil" icon="person-fill" scale="1.25"></b-icon><b-tooltip target="miPerfil" triggers="hover" positioning="bottom" variant="light">Mi perfil</b-tooltip> </b-nav-item>
            <b-nav-item id="logout" v-on:click="active" v-if="clientLogged" href="/client/logout"><b-icon id="cerrarSesion" icon="power" aria-hidden="true" scale="1.25"></b-icon><b-tooltip target="cerrarSesion" triggers="hover" positioning="bottom" variant="danger">Cerrar sesión</b-tooltip></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
  <hr>
  </header>
</template>


<script>
export default {
  name: "Header",
  computed: {
    clientLogged(){
      return (this.$cookies.get("Session")) ? true : false
    }
  },

  methods: {
    active(){

    }
  }
}

</script>

<style scoped>
@import "../css/generalStyle.css";

.logo {
  width: 200px;
}

#menuFijado {
  position: fixed;
  width: 100%;
  z-index: 100;
  margin-bottom: 20px;
}

hr {
  margin-top: 0rem;
}

.navbar-light .navbar-nav .nav-link {
  color: rgba(54, 107, 157, 0.74);
}

#portal:hover, #movimientos:hover, #portfolio:hover, #login:hover, #logout:hover, #perfil:hover {
  transform: scale(1.15);
}

</style>