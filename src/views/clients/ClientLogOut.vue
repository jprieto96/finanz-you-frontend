<template>
  <div></div>
</template>

<script>
export default {
  name: "ClientLogOut",
  created() {
    if(this.$cookies.get("Session") == null) {
      localStorage.clear()
      window.location.href = '/login'
    }
    else {
      this.$cookies.remove("Session")
      localStorage.clear()
      window.location.href = '/'
    }
  }
}
</script>

<style scoped>

</style>