<template>
  <div class="add-item" @submit.prevent="addItem">
    <form>
      <h1 class="text-center text-light">Add New Item</h1>
      <div class="input-field">
        <label class="d-block fw-bold mb-3">Name</label>
        <input type="text" placeholder="item name" v-model="name" />
        <p class="text-danger fw-bold" v-if="v$.name.$error">
          {{ v$.name.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field">
        <label class="d-block fw-bold mb-3">Description</label>
        <input type="text" placeholder="item description" v-model="desc" />
        <p class="text-danger fw-bold" v-if="v$.desc.$error">
          {{ v$.desc.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field">
        <label class="d-block fw-bold mb-3">Price</label>
        <input type="number" placeholder="price" v-model="price" />
        <p class="text-danger fw-bold" v-if="v$.price.$error">
          {{ v$.price.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field">
        <label class="d-block fw-bold mb-3">Quantity</label>
        <input type="number" placeholder="quantity" v-model="qty" />
        <p class="text-danger fw-bold" v-if="v$.qty.$error">
          {{ v$.qty.$errors[0].$message }}
        </p>
      </div>
      <div class="submit text-center">
        <button class="btn btn-success">Add</button>
      </div>
      <div class="text-center text-success fw-bold" v-if="successMessage">
        {{ successMessage }}
      </div>
      <div class="text-center text-danger fw-bold" v-if="ErrorMessage">
        {{ ErrorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  decimal,
  integer,
} from "@vuelidate/validators";
import axios from "axios";
export default {
  props: ["category"],
  data() {
    return {
      name: "",
      desc: "",
      price: "",
      qty: "",
      showNotification: false,
      theme: "",
      notify: "",
      v$: useValidate(),
      items: [],
      ErrorMessage: "",
      successMessage: "",
    };
  },
  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
      desc: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(100),
      },
      price: {
        required,
        decimal,
      },
      qty: {
        required,
        integer,
      },
    };
  },
  methods: {
    async addItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let user = JSON.parse(localStorage.getItem("user"));
        let result = await axios.post("http://localhost:3000/items", {
          name: this.name,
          price: this.price,
          description: this.desc,
          qty: this.qty,
          catId: this.category.id,
          userId: user.id,
        });
        if (result.status == 201) {
          setTimeout(() => {
            this.successMessage = `${this.name} Added Successfully`;
            this.ErrorMessage = "";

            location.reload();
          }, 1000);
        } else {
          this.ErrorMessage = "Something Went Wrong, try again";
          this.successMessage = ``;
        }
      } else {
        this.ErrorMessage = "Un Valid Item Data";
        this.successMessage = ``;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-item {
  width: 400px;
  min-height: 100px;
  background: linear-gradient(#222, #000);
  color: var(--light);
  position: absolute;
  top: 55px;
  left: 0%;
  z-index: 100;
  padding: 10px 15px;
  &::before {
    content: "";
    border-width: 30px;
    border-style: solid;
    border-color: transparent transparent rgba(60, 60, 60, 0.717) transparent;
    border-top: none;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
  }
  .input-field {
    label {
      color: var(--grey);
    }
    input {
      width: 100%;
      border: none;
      outline: none;
      padding-bottom: 5px;
      border-bottom: 1px solid #777;
      background-color: transparent;
      color: white;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: #999;
      }
    }
    margin-bottom: 40px;
  }
}
</style>
