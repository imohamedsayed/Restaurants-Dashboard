<template>
  <form class="sign" @submit.prevent="handleSubmit">
    <h1>Sign Up</h1>
    <div class="input-field">
      <h4>User Name</h4>
      <input type="text" placeholder="Enter Your Name" v-model="userName" />
      <div class="alert alert-danger" v-if="v$.userName.$error">
        {{ v$.userName.$errors[0].$message }}
      </div>
    </div>
    <div class="input-field">
      <h4>Email</h4>
      <input type="text" placeholder="Enter Your Email" v-model="userEmail" />
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
    <div class="check-terms">
      <input type="checkbox" v-model="terms" required />
      <label>Accept Terms</label>
    </div>
    <div class="submit d-flex justify-content-around flex-wrap gap-2">
      <button class="btn btn-info" type="submit">Sign Up</button>
      <button
        class="btn btn-info"
        style="background: var(--dark)"
        @click="goLogin"
      >
        Login
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
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
import Notification from "./Notification.vue";
export default {
  name: "SignUpForm",
  data() {
    return {
      v$: useValidate(),
      userName: "",
      userEmail: "",
      userPassword: "",
      terms: false,
      passErr: "",
      showNotification: false,
      theme: "",
      notify: "",
    };
  },
  validations() {
    return {
      userName: { required, minLength: minLength(5) },
      userPassword: { required, minLength: minLength(10) },
      userEmail: { required, email },
    };
  },
  methods: {
    async handleSubmit() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let existedEmails = [];

        let allEmailRes = await axios.get("http://localhost:3000/users");

        allEmailRes.data.forEach((acc) => {
          existedEmails.push(acc.email.toLowerCase());
        });

        if (existedEmails.includes(this.userEmail.toLowerCase().trim())) {
          this.theme = "error";
          this.notify = "This Email Is Already Existed";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);

          return;
        }

        let results = await axios.post("http://localhost:3000/users", {
          name: this.userName.trim(),
          email: this.userEmail.trim(),
          password: this.userPassword.trim(),
        });
        if (results.status === 201) {
          localStorage.setItem("user", JSON.stringify(results.data));
          this.$router.push({ name: "home" });
        } else {
          this.theme = "error";
          this.notify = "Something Went Wrong, try again..";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);
        }
      } else {
        this.theme = "error";
        this.notify = "UnValid Signup Data";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      }
    },
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    goLogin() {
      this.$router.push({ name: "login" });
    },
  },
  components: { Notification },
};
</script>

<style lang="scss">
.sign,
.login {
  h1 {
    display: inline-block;
    padding-bottom: 10px;
    border-bottom: 4px solid #333;
    margin-bottom: 60px;
  }
  max-width: 720px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 0 10px 1px var(--grey);
  border-radius: 10px;
  padding: 20px 30px;
  .input-field {
    h4 {
      color: var(--grey);
      margin: 0;
    }
    &:not(:last-of-type) {
      margin-bottom: 40px;
    }
    input {
      width: 100%;
      border: none;
      outline: none;
      padding: 10px 5px;
      padding-bottom: 10px;
      border-bottom: 1.5px solid #444;
      margin: 10px 0;
      &::placeholder {
        color: #cfcfcf;
      }
    }
  }
  .check-terms {
    input {
      width: 40px;
    }
    label {
      color: #222;
    }
  }
  .submit {
    margin: 40px;
    text-align: center;
    button {
      width: 200px;
      color: white;
      background-color: var(--primary);
      border: none;
      outline: none;
      transition: all 0.3s ease;
      &:hover {
        background-color: var(--primary);
        color: #fff;
        transform: scale(1.05);
      }
    }
  }
}
</style>
