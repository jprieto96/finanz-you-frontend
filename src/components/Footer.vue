<template>
  <footer class="footer">
    <section>&copy; 2022 Copyright</section>
    <a href="/"> FinanzYou </a>
  </footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
footer {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* position: fixed; */
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #232323;
  color: aliceblue;
}
section{
  padding-right: 10px;
}

a {
  color: rgba(54, 107, 157, 0.74);
}

a:hover {
  transform: scale(1.15);
  color: aliceblue;
  text-decoration: none;
}

</style>