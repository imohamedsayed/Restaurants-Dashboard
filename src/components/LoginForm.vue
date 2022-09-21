<template>
  <form class="login" @submit.prevent="handleSubmit">
    <h1>Login</h1>
    <div class="input-field">
      <h4>Email</h4>
      <input type="text" placeholder="Email" v-model="userEmail" />
      <div class="alert alert-danger" v-if="v$.userEmail.$error">
        {{ v$.userEmail.$errors[0].$message }}
      </div>
    </div>
    <div class="input-field">
      <h4>Password</h4>
      <input type="password" v-model="userPassword" />
      <div class="alert alert-danger" v-if="v$.userPassword.$error">
        {{ v$.userPassword.$errors[0].$message }}
      </div>
    </div>
    <div class="submit d-flex justify-content-around flex-wrap gap-2">
      <button class="btn btn-info" type="submit">Login</button>
      <button class="btn btn-info sign-up" type="submit" @click="goSign">
        Sign Up
      </button>
    </div>
  </form>
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
import useValidate from "@vuelidate/core";
import { required, email, minLength, not } from "@vuelidate/validators";
import Notification from "./Notification.vue";
import axios from "axios";
export default {
  name: "LoginForm",
  components: { Notification },
  data() {
    return {
      v$: useValidate(),
      userEmail: "",
      userPassword: "",
      showNotification: false,
      theme: "",
      notify: "",
    };
  },
  validations() {
    return {
      userEmail: { required, email },
      userPassword: { required },
    };
  },
  mounted() {
    let user = localStorage.getItem("user");
    if (user) {
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async handleSubmit() {
      this.v$.$validate();

      if (!this.v$.$error) {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.userEmail}&password=${this.userPassword}`
        );
        if ((result.status = 200 && result.data.length > 0)) {
          this.theme = "success";
          this.notify = "Logged In Successfully";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);

          localStorage.setItem("user", JSON.stringify(result.data[0]));
          this.$router.push({ name: "home" });
        } else {
          this.theme = "error";
          this.notify = "Wrong email or password";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);
        }
      } else {
        this.theme = "error";
        this.notify = "Un Valid Login Data";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      }
    },
    goSign() {
      this.$router.push({ name: "signup" });
    },
  },
};
</script>
<style lang="scss">
.login {
  .sign-up {
    background-color: var(--dark) !important;
  }
}
</style>
