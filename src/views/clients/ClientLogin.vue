<template>
  <div class="centrarContenido" v-if="showLogin">
    <div class="title-container"><h1>Login</h1></div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
          id="input-group-user"
          label="Usuario"
          label-for="input-user"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="8"
      >
        <b-form-input
            id="input-user"
            v-model="form.user"
            type="text"
            :state="userValidator"
            placeholder=""
            class="text-center"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-password"
          label="Contraseña"
          label-for="input-password"
          description="minimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="8"
      >
        <b-form-input
            id="input-password"
            v-model="form.password"
            type="password"
            placeholder=""
            :state="passwordValidator"
            aria-describedby="input-live-help input-live-feedback"
            class="text-center"
            required
        ></b-form-input>
      </b-form-group>

      <div id="buttons" class="d-flex justify-content-center">
        <b-button :disabled="!enabledButton" class="button-success" type="submit" variant="primary">Iniciar Sesión</b-button>
        <b-button class="button-cancel" type="reset" variant="danger">Cancelar</b-button>
      </div>

      <br>

      <p>¿No estás registrado? <a href="/register">Registrate</a></p>
    </b-form>

    <b-modal id="modal-1" title="BootstrapVue">
      <p class="my-4">Hello from modal!</p>
    </b-modal>

    <ModalMessage
        :message="modal.message"
        :title="modal.title"
        :variant="modal.variant"
        class="custom-modal"
    ></ModalMessage>
    <div class="loading" v-if="isLoading">
     <loading :active="true"
              :can-cancel="false"
              :is-full-page="false"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModalMessage from "@/components/Modal";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: "Login",
  components: {ModalMessage, Loading},
  data() {
    return {
      backURL: process.env.VUE_APP_BACK_URL,
      isLoading: false,
      form: {
        user: '',
        password: '',
      },
      show: true,
      modal: {
        title: '',
        message: '',
        variant: '',
      },
      showLogin: false
    }
  },
  computed: {
    enabledButton() {
      return this.userValidator && this.passwordValidator;
    },
    userValidator() {
      if (this.form.user == '') return null
      return !/[^a-zA-Z0-9-_]/.test(this.form.user);
    },
    passwordValidator() {
      if (this.form.password == '') return null
      return /^(?=\w*\d)(?=\w*[a-z])(?=\w*[A-Z])\S{8,}$/.test(this.form.password) && this.form.password.length >= 8;
    }
  },
  methods: {
    onSubmit(event) {
      console.log(this.backURL)
      event.preventDefault()
      let newForm = {}
      newForm.username = this.form.user
      newForm.password = window.btoa(unescape(encodeURIComponent(this.form.password + "tfgPROT01")));
      this.isLoading = true
      axios
          .post(this.backURL + 'login', newForm)
          .then(response => {
            let d = new Date();
            d.setTime(d.getTime() + 1 * 60 * 60 * 1000);
            let expires = "expires=" + d.toUTCString();
            document.cookie =
                "Session=" + response.data + ";" + expires + ";path=/";
            this.showSuccessModal(response.data)
            this.resetForm()
            localStorage.clear()
            this.isLoading = false
            window.location.href = '/client'
          })
          .catch((err) => {
            this.isLoading = false
            this.showWarningModal(err.response.data)
          })
    },
    onReset(event) {
      event.preventDefault()
      this.resetForm()
    },
    resetForm() {
      this.form.user = ''
      this.form.password = ''
    },
    showSuccessModal() {
      this.$bvModal.show("modal")
      this.modal.title = "¡Operación Exitosa!"
      this.modal.message = "Has iniciado sesión correctamente"
      this.modal.variant = 'success'
    },
    showWarningModal(message) {
      this.$bvModal.show("modal")
      this.modal.message = message
      this.modal.title = "¡Operación Fallida!"
      this.modal.variant = 'warning'
    }
  },
  created() {
    if(this.$cookies.get("Session")) {
      window.location.href = '/client'
    }
    else {
      this.showLogin = true
    }
  }
}
</script>

<style scoped>
@import "../../css/generalStyle.css";


</style>