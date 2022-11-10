<template>
  <div id="perfil" class="centrarContenido" v-if="showView">
      <div class="title-container"><h1>Mi perfil</h1></div>
        <div id="editProfile">
          <p><b-row>
            <b-col class="card-text">DNI</b-col>
            <b-col class="card-result">{{ this.infoUser.dni }}</b-col>
          </b-row></p>
          <p><b-row>
            <b-col class="card-text">Usuario</b-col>
            <b-col v-if="!editProfile" class="card-result">{{ this.infoUser.username }}</b-col>
            <b-col v-else class="card-result"><b-form-input type="text" id="newUsername" v-model="newUsername" v-bind:state="userValidator" placeholder="nombre de usuario"></b-form-input></b-col>
          </b-row></p>
          <p v-if="editProfile"><b-row>
            <b-col class="card-text">Antigua contraseña</b-col>
            <b-col class="card-result"><b-form-input type="password" id="oldPassword" v-model="oldPassword" v-bind:state="oldPasswordValidator" placeholder="contraseña antigua" ></b-form-input></b-col>
          </b-row></p>
          <p v-if="editProfile"><b-row>
            <b-col class="card-text">Nueva contraseña</b-col>
            <b-col class="card-result"><b-form-input type="password" id="newPassword" v-model="newPassword" v-bind:state="passwordValidator" placeholder="nueva contraseña"></b-form-input></b-col>
          </b-row></p>
          <p v-if="editProfile"><b-row>
            <b-col class="card-text">Confirmar nueva contraseña</b-col>
            <b-col class="card-result"><b-form-input type="password" id="newPasswordCheck" v-model="newPasswordCheck" v-bind:state="newPasswordValidator" placeholder="repita nueva contraseña" required></b-form-input></b-col>
          </b-row></p>
          <p class="card-edit">
            <b-button :disabled="!enabledButton" v-if="editProfile" id="confirmEdit" variant="success" v-on:click="onSubmit">Confirmar cambios</b-button>
          </p>
          <br>
          <p class="card-edit">
            <b-button v-if="editProfile===false" id="editUserData" variant="outline-secondary" v-on:click="editProfile=true"><b-icon icon="pencil-square"></b-icon></b-button>
            <b-button v-else id="noEditUserData" variant="outline-secondary" v-on:click="editProfile=false"><b-icon icon="pencil-square"></b-icon></b-button>
          </p>
        </div>
      </div>

</template>

<script>
import axios from "axios";

export default {
  name: "ClientProfile",
  data(){
    return{
      //apiKey: process.env.VUE_APP_APIKEY,
      backURL: process.env.VUE_APP_BACK_URL,
      errorMSG: process.env.VUE_APP_ERROR_MSG,
      infoUser : null,
      showView: false,
      editProfile: false,
      oldPassword: null,
      oldUsername: null,
      newUsername: null,
      newPassword: null,
      newPasswordCheck: null,
      oldPasswordValidator: true,
    }
  },
  created() {
    if(this.$cookies.get("Session") == null) {
      localStorage.clear()
      window.location.href = '/login'
    }
    else {
      this.getData()
    }
  },
  computed: {
    enabledButton() {
      return this.userValidator && this.passwordValidator && this.newPasswordValidator;
    },
    userValidator() {
      if (this.newUsername == '' || this.newUsername == this.oldUsername) return null;
      return !/[^a-zA-Z0-9-_]/.test(this.newUsername);
    },
    passwordValidator() {
      if (this.newPassword == '') return null;
      return /^(?=\w*\d)(?=\w*[a-z])\S{8,}$/.test(this.newPassword) && this.newPassword.length >= 8;
    },
    newPasswordValidator() {
      if (this.newPasswordCheck == '') return null;
      return /^(?=\w*\d)(?=\w*[a-z])\S{8,}$/.test(this.newPasswordCheck) && this.newPasswordCheck.length >= 8 && (this.newPasswordCheck == this.newPassword);
    },
  },
  methods:{
    getData(){
      this.infoUser = JSON.parse(localStorage.getItem("infoUser"))

      if(this.infoUser === null){
        let hashClient = this.$cookies.get("Session")

        axios.get(this.backURL + 'client/showDetails/' + hashClient)
                  .then(response => {
                    this.infoUser = response.data;
                    this.oldUsername = this.infoUser.username;
                    localStorage.setItem("infoUser", JSON.stringify(this.infoUser));
                    this.showView = true;
                  })
                  .catch((err) => {
                    this.showWarningModal(err.response.data)
                  })
      }
      else{
        this.showView = true;
      }
    },
    onSubmit(){
      this.checkOldPassword().then(truePassword => {
        if(truePassword) {
          let userForm = {}
          userForm.id = this.infoUser.id;
          userForm.dni = this.infoUser.dni;
          userForm.username = this.newUsername;
          userForm.password = window.btoa(unescape(encodeURIComponent(this.newPassword + "tfgPROT01")));
          userForm.active = this.infoUser.active;

          axios
              .post(this.backURL + 'client/editClient', userForm)
              .then(response => {
                this.infoUser = response.data;
                localStorage.removeItem("infoUser");
                this.editProfile = false;
              })
              .catch((err) => {
                this.showWarningModal(err.response.data)
              })

        }
      });

    },
    async checkOldPassword(){
      let oldUserForm = {}
      oldUserForm.id = this.infoUser.id;
      oldUserForm.dni = this.infoUser.dni;
      oldUserForm.username = this.infoUser.username;
      oldUserForm.password = window.btoa(unescape(encodeURIComponent(this.oldPassword + "tfgPROT01")));
      oldUserForm.active = this.infoUser.active;

      await axios
          .post( this.backURL + 'client/oldPasswordCheck', oldUserForm)
          .then(response => {
            this.oldPasswordValidator = response.data;
            return response.data;
          })
          .catch(() => {
            this.oldPasswordValidator = false;
            return false;
          })

      return this.oldPasswordValidator;
    }
  }
}
</script>

<style scoped>
@import "../../css/generalStyle.css";

.card-text{
  text-align: left;
}

.card-edit{
  text-align: right;
}

.card-result{
  text-align: right;
}

#editProfile{
  width: 50%;
}

#editUserData, #noEditUserData{
  background-color: white;
  border-color: white;
  color: rgba(54, 107, 157);
}

</style>