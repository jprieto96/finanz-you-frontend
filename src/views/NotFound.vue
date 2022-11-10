<template>
  <section class="error-container">
    <div class="code">404</div>
    <div class="message">La página que buscas aún no se encuentra disponible</div>
    <b-button variant="outline-primary" href="/">Volver a inicio</b-button>
  </section>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Chango&display=swap');

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 500px;
}

.code {
  font-family: 'Chango', cursive;
  font-size: 64px;
}

.message {
  font-family: 'Chango', cursive;
  font-size: 24px;
}
</style>