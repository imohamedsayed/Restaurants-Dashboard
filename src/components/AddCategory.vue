<template>
  <transition name="add-Modal-trans">
    <div class="addModal" v-show="showAddition">
      <h1>Add New Category to {{ restaurant.name }}</h1>
      <form @submit.prevent="AddCat">
        <label class="d-block">Category Name</label>
        <input
          type="text"
          placeholder="type category name ..."
          v-model="categoryName"
        />
        <p class="text-danger fw-bold" v-if="v$.categoryName.$error">
          {{ v$.categoryName.$errors[0].$message }}
        </p>
        <div class="submit mt-3 text-center">
          <button class="btn btn-outline-warning" @click="addNow">ADD</button>
        </div>
      </form>
      <div class="back" @click="closeMe">
        <i class="fa-solid fa-angles-left"></i>
      </div>
    </div>
  </transition>
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
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import axios from "axios";
import Notification from "./Notification.vue";
export default {
  props: ["restaurant", "showAddition"],
  data() {
    return {
      showNotification: false,
      theme: "",
      notify: "",
      v$: useValidate(),
      categoryName: "",
      existedCategories: [],
    };
  },
  validations() {
    return {
      categoryName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
    };
  },
  methods: {
    closeMe() {
      this.$emit("closeAdd");
    },
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async addNow() {
      this.v$.$validate();

      let allCResuts = await axios.get(
        `http://localhost:3000/categories?restId=${this.restaurant.id}`
      );

      if (allCResuts.status == 200 && allCResuts.data.length > 0) {
        allCResuts.data.forEach((c) => {
          this.existedCategories.push(c.name.toLowerCase());
        });
      } else {
        console.warn(
          "some thing went wrong while getting existed cats or no cats found"
        );
      }
      if (this.existedCategories.includes(this.categoryName.toLowerCase())) {
        this.theme = "error";
        this.notify = "This Category Is Already Existed";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
        return;
      }
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/categories`, {
          name: this.categoryName,
          restId: this.restaurant.id,
        });
        if (result.status == 201) {
          this.theme = "success";
          this.notify = "Category Added Successfully";
          this.showNotification = true;
          setTimeout(() => {
            this.categoryName = "";
            this.showNotification = false;
            this.v$.categoryName.$errors[0].$message = "";
            location.reload();
          }, 2000);
        } else {
          this.theme = "error";
          this.notify = "Something Went Wrong, try again ...";
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          }, 2000);
        }
      } else {
        this.theme = "error";
        this.notify = "Un Correct Category Name";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      }
    },
  },
  components: { Notification },
};
</script>

<style lang="scss" scoped>
.addModal {
  position: fixed;
  background: linear-gradient(to right, black, rgba(51, 51, 51, 0.67));
  padding: 10px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  top: 10%;
  h1 {
    color: var(--menu);
    font-weight: bold;
  }
  form {
    label {
      color: var(--grey);
      font-size: 1.3rem;
      margin-bottom: 12px;
    }
    input {
      width: 100%;
      height: 40px;
      background-color: transparent;
      color: #fa0;
      border: none;
      padding-bottom: 5px;
      border-bottom: 3px solid gold;
      font-size: 20px;
      &:focus {
        outline: none;
      }
    }
  }
  .back {
    position: absolute;
    background-color: var(--menu);
    top: 45%;
    right: -25px;
    transform: translateY(-50%);
    font-size: 29px;
    padding: 10px 15px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0px 0px 15px 3px var(--menu);
    }
  }
}

.add-Modal-trans-enter-active,
.add-Modal-trans-leave-active {
  transition: all 0.8s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.add-Modal-trans-enter-from,
.add-Modal-trans-leave-to {
  transform: translateX(-1000px);
}
</style>
