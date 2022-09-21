<template>
  <teleport to="body">
    <transition name="additionForm">
      <div class="modal-content" v-if="showAdd">
        <div class="back" @click="emitClose">
          <i class="fa-solid fa-angles-right"></i>
        </div>
        <form @submit.prevent="addRest">
          <h1 class="text-center text-light mb-4">Add New Resturant</h1>
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
            <button>Add</button>
          </div>
        </form>
      </div>
    </transition>
  </teleport>
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
import { required, integer, minLength } from "@vuelidate/validators";
import Notification from "./Notification.vue";
import axios from "axios";
//end importing
export default {
  props: ["showAdd"],
  components: { Notification },
  data() {
    return {
      v$: useValidate(),
      restName: "",
      restPhone: "",
      restAddress: "",
      showNotification: false,
      theme: "",
      notify: "",
      userId: "",
    };
  },
  validations() {
    return {
      restName: { required, minLength: minLength(2) },
      restPhone: { required, integer, minLength: minLength(11) },
      restAddress: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userId = user.id;
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    emitClose() {
      this.$emit("close");
    },
    async addRest() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post("http://localhost:3000/rests", {
          name: this.restName.trim(),
          phone: this.restPhone.trim(),
          address: this.restAddress.trim(),
          userId: this.userId,
        });
        if (result.status == 201) {
          this.theme = "success";
          this.notify = "Restaurant Added Successfully";
          this.showNotification = true;
          setTimeout(() => {
            this.restName = "";
            this.restPhone = "";
            this.restAddress = "";
            this.showNotification = false;
            this.v$.restName.$errors[0].$message = "";
            this.v$.restPhone.$errors[0].$message = "";
            this.v$.restAddress.$errors[0].$message = "";
            location.reload();
          }, 2000);
        } else {
          this.theme = "error";
          this.notify = "Something Went Wrong, try again...";
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
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(black, 0.1);
  padding: 8px 0;
  padding-right: 15px;
}
.modal-content {
  position: absolute;
  top: 60px;
  right: 15px;
  height: 80vh;
  width: 60%;
  background-color: var(--dark) !important;
  padding: 30px !important;
  &::-webkit-scrollbar {
    display: none;
  }
  .back {
    color: var(--light);
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 1.6rem;
    border-radius: 35px;
    transition: all 0.3s ease;
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background-color: rgba(198, 198, 198, 0.529);
    }
  }
  .input-field {
    &:not(:last-of-type) {
      margin-bottom: 40px;
    }
    label {
      font-size: 1.8rem;
      margin-bottom: 2px;
      color: var(--light);
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

.additionForm-enter-active,
.additionForm-leave-active {
  transition: all 0.8s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.additionForm-enter-from,
.additionForm-leave-to {
  transform: translateX(700px);
}
</style>
