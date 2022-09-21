<template>
  <Header />
  <div class="container mt-5 py-3">
    <form @submit.prevent="updateData">
      <h1 class="text-center text-light mb-4">
        Update <span class="text-warning">{{ name }}</span> Data
      </h1>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Name </label>
        <input
          type="text"
          placeholder="Type your restaurant name .."
          v-model="restName"
        />
        <p class="text-danger fw-bold" v-if="v$.restName.$error">
          {{ v$.restName.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Phone </label>
        <input
          type="text"
          placeholder="Type your restaurant phone number.."
          v-model="restPhone"
        />
        <p class="text-danger fw-bold" v-if="v$.restPhone.$error">
          {{ v$.restPhone.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Address </label>
        <input
          type="text"
          placeholder="Type your restaurant address .."
          v-model="restAddress"
        />
        <p class="text-danger fw-bold" v-if="v$.restAddress.$error">
          {{ v$.restAddress.$errors[0].$message }}
        </p>
      </div>
      <div class="submit text-center">
        <button>Update</button>
      </div>
    </form>
  </div>
  <teleport to="body">
    <Notification
      @close="toggleNotification"
      :theme="theme"
      :showNotification="showNotification"
    >
      <p>{{ notify }}</p>
    </Notification>
  </teleport>
</template>

<script>
import Header from "@/components/Header.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, integer, minLength } from "@vuelidate/validators";
import Notification from "../components/Notification.vue";

export default {
  components: { Header, Notification },
  props: ["id"],
  data() {
    return {
      v$: useValidate(),
      restName: "",
      restPhone: "",
      restAddress: "",
      userId: "",
      showNotification: false,
      theme: "",
      notify: "",
      name: "",
    };
  },
  validations() {
    return {
      restName: { required, minLength: minLength(2) },
      restPhone: { required, integer, minLength: minLength(11) },
      restAddress: { required, minLength: minLength(10) },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.push({ name: "login" });
    } else {
      this.userId = JSON.parse(user).id;
      let result = await axios.get(`http://localhost:3000/rests/${this.id}`);
      if (result.status == 200) {
        let restaurant = result.data;
        if (restaurant.userId != this.userId) {
          this.$router.push({ name: "home" });
        }
        this.restName = restaurant.name;
        this.name = restaurant.name;
        this.restPhone = restaurant.phone;
        this.restAddress = restaurant.address;
      } else {
        console.warn("SomeThing Went Wrong");
      }
    }
  },
  methods: {
    async updateData() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(`http://localhost:3000/rests/${this.id}`, {
          name: this.restName.trim(),
          phone: this.restPhone.trim(),
          address: this.restAddress.trim(),
          userId: this.userId,
        });
        if (result.status == 200) {
          this.theme = "success";
          this.notify = `${this.restName} Data Updated Successfully `;
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
            location.reload();
          }, 2000);
        } else {
          this.theme = "error";
          this.notify = "Something went wrong, try again ...";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);
        }
      } else {
        this.theme = "error";
        this.notify = "Missing Restaurant Data";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      }
    },
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  background: linear-gradient(to right, #1e293b, #334155);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 8px 14px 20px 1px var(--grey);
  .input-field {
    &:not(:last-of-type) {
      margin-bottom: 40px;
    }
    label {
      font-size: 1.8rem;
      margin-bottom: 2px;
      color: var(--grey);
      span {
        font-size: 1.2rem;
      }
    }
    input {
      width: 100%;
      height: 50px;
      font-size: 1.3rem;
      background-color: transparent;
      color: var(--light);
      border: none;
      outline: none;
      padding: 10px 5px;
      padding-bottom: 10px;
      border-bottom: 4px solid #444;
      margin: 10px 0;
      &::placeholder {
        color: #cfcfcf53;
      }
    }
  }
  button {
    background-color: var(--primary);
    width: 120px;
    padding: 10px 20px;
    border-radius: 10px;
    color: var(--light);
  }
}
</style>
