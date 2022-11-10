<template>
  <div>
    <b-modal id="modal" body-class="modal-class" hide-header hide-footer centered>
      <b-alert id="alert"
               show
               :variant=variant>
        <h4 class="alert-heading">{{ this.title }}</h4>
        <p>
          {{ this.message }}
        </p>
      </b-alert>
    </b-modal>
  </div>

</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      show: true,
      hideFooter: true,
      hideHeader: true
    }
  },
  props: {
    message: String,
    title: String,
    variant: String,
  }
}
</script>

<style scoped>

/deep/ .modal-class {
  padding: 0;
}

#alert {
  margin: 0;
}

#modal {
  background-color: #007bff;
}

</style>