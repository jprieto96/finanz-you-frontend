<template>
  <div class="centrarContenido">
    <h1 class="title-container">Nueva cuenta</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
          id="input-group-dni"
          label="DNI"
          label-for="input-dni"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="8"
      >
        <b-form-input
            id="input-dni"
            v-model="form.dni"
            type="text"
            placeholder=""
            :state="dniValidator"
            class="text-center"
            required
        ></b-form-input>
      </b-form-group>

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
        <b-button :disabled="!enabledButton" class="button-success" type="submit">Registrar
        </b-button>
        <b-button class="button-cancel" type="reset" variant="danger">Cancelar</b-button>
      </div>

      <br>
      <p>¿Ya estás registrado? <a href="/login">Inicia Sesión</a></p>
    </b-form>

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
  name: "NewClient",
  components: {ModalMessage, Loading},
  data() {
    return {
      backURL: process.env.VUE_APP_BACK_URL,
      isLoading: false,
      form: {
        user: '',
        password: '',
        dni: ''
      },
      show: true,
      modal: {
        title: '',
        message: '',
        variant: '',
      }
    }
  },
  computed: {
    enabledButton() {
      return this.userValidator && this.passwordValidator && this.dniValidator;
    },
    userValidator() {
      if (this.form.user == '') return null
      return !/[^a-zA-Z0-9-_]/.test(this.form.user);
    },
    passwordValidator() {
      if (this.form.password == '') return null
      return /^(?=\w*\d)(?=\w*[a-z])(?=\w*[A-Z])\S{8,}$/.test(this.form.password) && this.form.password.length >= 8;
    },
    dniValidator() {
      if (this.form.dni == '') return null
      return this.validateDni(this.form.dni)
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      let newForm = {}
      newForm.username = this.form.user
      newForm.password = window.btoa(unescape(encodeURIComponent(this.form.password + "tfgPROT01")));
      newForm.dni = this.form.dni
      this.isLoading = true
      axios
          .post(this.backURL + 'client/create', newForm)
          .then(response => {
            this.showSuccessModal(response.data)
            this.resetForm()
            localStorage.clear()
            this.isLoading = false
            window.location.href = '/login'
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
      this.form.dni = ''
    },
    showSuccessModal(client) {
      this.$bvModal.show("modal")
      this.modal.title = "¡Operación Exitosa!"
      this.modal.message = "Te has registrado correctamente: " + client.username
      this.modal.variant = 'success'
    },
    showWarningModal(message) {
      this.$bvModal.show("modal")
      this.modal.message = message
      this.modal.title = "¡Operación Fallida!"
      this.modal.variant = 'warning'
    },
    validateDni(dni) {
      let regExpDni = /^\d{8}[A-Z]$/;
      if (regExpDni.test(dni) == true) {
        let number = dni.substr(0, dni.length - 1);
        let letterId = dni.substr(dni.length - 1, 1);
        let letter = 'TRWAGMYFPDXBNJZSQVHLCKET';
        number = number % 23;
        return letter.substring(number, number + 1) == letterId.toUpperCase()
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
@import "../../css/generalStyle.css";



</style>