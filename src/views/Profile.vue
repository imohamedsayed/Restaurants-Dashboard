<template>
  <div class="profile">
    <div class="container">
      <div class="user-preview d-md-flex d-none">
        <div class="img-box p-4 mb-5">
          <img
            src="../assets/user.jpg"
            class="img-fluid rounded-circle"
            alt=""
          />
        </div>
        <div class="name mb-4">
          <h3 class="text-uppercase">User Name</h3>
          <h2>{{ name }}</h2>
        </div>
        <div class="email">
          <h3 class="text-uppercase">Email</h3>
          <h2>{{ email }}</h2>
        </div>
      </div>
      <div class="edit p-4">
        <img src="../assets/user.jpg" class="topImg d-md-none d-block" alt="" />
        <form @submit.prevent="updateProfile">
          <h2 class="text-center mb-5 text-warning d-md-block d-none">
            Update Your Profile
          </h2>
          <div class="input-field mt-b-md-3 mt-5">
            <label class="d-block"
              >Name
              <span class="text-danger" v-if="v$.userName.$error">
                * {{ v$.userName.$errors[0].$message }}
              </span></label
            >
            <input
              type="text"
              placeholder="Type your updated name .."
              v-model="userName"
            />
          </div>
          <div class="input-field">
            <label class="d-block"
              >Email
              <span class="text-danger" v-if="v$.userEmail.$error">
                * {{ v$.userEmail.$errors[0].$message }}
              </span></label
            >
            <input
              type="email"
              placeholder="Type your updated email address .."
              v-model="userEmail"
            />
          </div>
          <div class="input-field">
            <label class="d-block"
              >Old Password
              <span class="text-danger" v-if="v$.userOldPassword.$error">
                * {{ v$.userOldPassword.$errors[0].$message }}
              </span></label
            >
            <input type="password" v-model="userOldPassword" />
          </div>
          <div class="input-field">
            <label class="d-block"
              >New Password
              <span class="text-danger" v-if="v$.userNewPassword.$error">
                * {{ v$.userNewPassword.$errors[0].$message }}
              </span></label
            >
            <input type="password" v-model="userNewPassword" />
          </div>
          <div class="submit text-center">
            <button>Update</button>
          </div>
        </form>
      </div>
    </div>
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
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import Notification from "../components/Notification.vue";
import axios from "axios";
export default {
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      userName: "",
      userEmail: "",
      password: "",
      userOldPassword: "",
      userNewPassword: "",
      showNotification: false,
      userId: "",
      theme: "",
      notify: "",
    };
  },
  components: { Notification },
  validations() {
    return {
      userName: { required, minLength: minLength(5) },
      userNewPassword: { required, minLength: minLength(10) },
      userEmail: { required, email },
      userOldPassword: { required },
    };
  },
  mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.push({ name: "login" });
    } else {
      this.userInfo = JSON.parse(localStorage.getItem("user"));
      this.name = this.userInfo.name;
      this.email = this.userInfo.email;
      this.userName = this.userInfo.name;
      this.userEmail = this.userInfo.email;
      this.password = this.userInfo.password;
      this.userId = this.userInfo.id;
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async updateProfile() {
      this.v$.$validate();
      if (!this.v$.$error && this.password === this.userOldPassword) {
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

        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.userName.trim(),
            email: this.userEmail.trim(),
            password: this.userNewPassword.trim(),
          }
        );
        if (result.status == 200) {
          this.theme = "success";
          this.notify = "Data updated Successfully";
          this.showNotification = true;
          localStorage.setItem("user", JSON.stringify(result.data));
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          this.theme = "error";
          this.notify = "Something went wrong, try again..";
          this.showNotification = true;
        }
      } else {
        this.theme = "error";
        if (this.password !== this.userOldPassword) {
          this.notify = "Old Password Is Wrong";
        } else {
          this.notify = "There is error in updating data";
        }
        this.showNotification = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  width: 100%;
  height: 100%;
  padding-top: 1rem;
  @media (max-width: 768px) {
    padding-top: 4rem;
  }
  .container {
    display: flex;
    .user-preview {
      height: 95vh;
      width: 320px;
      background: linear-gradient(to right, #334155, #1e293b);
      display: flex;
      flex-direction: column;
      padding: 20px 10px;
      overflow: hidden;
      .name,
      .email {
        text-overflow: ellipsis;
      }
      h3 {
        color: var(--grey);
        font-size: 1.4rem;
      }
      h2 {
        font-size: 1.3rem;
        word-wrap: break-word;
        color: var(--light);
      }
    }
    .edit {
      flex: 1 1 0;
      background-color: var(--dark);
      position: relative;
      .topImg {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 0 5px 2px var(--light);
      }
      .input-field {
        &:not(:last-of-type) {
          margin-bottom: 40px;
        }
        label {
          font-size: 1.8rem;
          margin-bottom: 15px;
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
  }
}
</style>
