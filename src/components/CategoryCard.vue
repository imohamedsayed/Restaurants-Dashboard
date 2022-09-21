<template>
  <div class="category mt-2 mb-5">
    <div class="categoryName">{{ category.name }}</div>
    <button
      class="addItem"
      title="add item to cat.."
      @click="showAdd = !showAdd"
    >
      <i class="fa-solid fa-square-plus"></i>
    </button>
    <button class="deleteItem" @click="deleteCat">
      <i class="fa-solid fa-trash"></i>
    </button>
    <table>
      <Meal v-for="item in items" :key="item.id" :item="item" />
    </table>
    <button
      class="UpdateItem"
      title="update this cat. name"
      @click="show = !show"
    >
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <transition name="update">
      <form class="updateCat" v-show="show" @submit.prevent="updateCat">
        <label class="d-block ms-2 fw-bold text-dark"
          >New Name for {{ category.name }}</label
        >
        <input
          type="text"
          class="mt-2 form-control"
          placeholder="type the new name"
          v-model="newCatName"
        />
        <p class="text-warning fw-bold ms-1" v-if="v$.newCatName.$error">
          {{ v$.newCatName.$errors[0].$message }}
        </p>
        <div class="text-center mt-2 submit">
          <button class="btn btn-warning">Update</button>
        </div>
      </form>
    </transition>
    <transition name="update">
      <AddItem :category="category" v-show="showAdd" />
    </transition>
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
import { required, minLength, maxLength } from "@vuelidate/validators";
import axios from "axios";
import Notification from "./Notification.vue";
import Meal from "./Meal.vue";
import AddItem from "./AddItem.vue";
export default {
  props: ["category", "restaurant"],
  data() {
    return {
      showNotification: false,
      theme: "",
      notify: "",
      show: false,
      newCatName: "",
      v$: useValidate(),
      existedCategories: [],
      items: [],
      showAdd: false,
    };
  },
  validations() {
    return {
      newCatName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
    };
  },
  async mounted() {
    let result = await axios.get(
      `http://localhost:3000/items?catId=${this.category.id}`
    );
    if (result.status == 200) {
      this.items = result.data;
    } else {
      console.log("Some Thing Went Wrong");
    }
  },
  methods: {
    async deleteCat() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.category.id}`
      );
      let flag = true;
      for (let i = 0; i < this.items.length; i++) {
        let delItemRes = await axios.delete(
          `http://localhost:3000/items/${this.items[i].id}`
        );
        if (delItemRes.status != 200) {
          flag = false;
        }
      }
      console.log(result);
      if (result.status == 200 && flag) {
        this.theme = "success";
        this.notify = `Deleted ${this.category.name} Successfully`;
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
          location.reload();
        }, 2000);
      } else {
        this.theme = "error";
        this.notify = "Something Went Wrong, try again...";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
          location.reload();
        }, 2000);
      }
    },
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async updateCat() {
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

      if (this.existedCategories.includes(this.newCatName.toLowerCase())) {
        this.theme = "error";
        this.notify = "This Category Is Already Existed";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
        return;
      }

      if (!this.v$.newCatName.$error) {
        let result = await axios.put(
          `http://localhost:3000/categories/${this.category.id}`,
          {
            name: this.newCatName,
            restId: this.restaurant.id,
          }
        );
        console.log(result);
        if (result.status == 200) {
          this.theme = "success";
          this.notify = "Category Updated Successfully";
          this.showNotification = true;
          setTimeout(() => {
            this.categoryName = "";
            this.showNotification = false;
            if (this.v$.newCatName.$error) {
              this.v$.newCatName.$errors[0].$message = "";
            }
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
  components: { Notification, Meal, AddItem },
};
</script>

<style lang="scss" scoped>
.category {
  min-height: 300px;
  border: 2px solid var(--menu);
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  border-top-left-radius: 10px;
  position: relative;
  padding-bottom: 60px;
  .categoryName {
    color: white;
    background-color: var(--menu);
    text-align: center;
    min-width: 30%;
    max-width: 70%;
    padding: 2px 6px;
    word-break: break-all;
    font-size: 1.2rem;
    position: absolute;
    top: -15px;
    border-radius: 25px;
    left: 40%;
    transform: translateX(-50%);
  }
  .addItem,
  .deleteItem,
  .UpdateItem {
    color: var(--menu);
    display: block;
    position: absolute;
    top: -30px;
    right: 10px;
    font-size: 3rem;
  }
  .deleteItem {
    color: crimson;
    right: 70px;
    top: -20px;
    font-size: 2rem;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.5);
    }
  }
  .UpdateItem {
    color: white;
    top: auto;
    font-size: 2rem;
    bottom: 3px;
    right: 5px;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.2);
    }
  }
  .updateCat {
    width: 270px;
    min-height: 120px;
    background-color: rgba(255, 255, 255, 0.433);
    z-index: 105;
    position: absolute;
    bottom: 35px;
    right: 40px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-right-radius: 5px;
  }
  table {
    color: var(--light);
    width: 100%;
    margin-top: 50px;
    font-size: 1.5rem;
  }
}

.update-enter-active,
.update-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.update-enter-from {
  opacity: 0;
}
.update-enter-to {
  opacity: 1;
}
.update-leave-from {
  opacity: 1;
}
.update-leave-to {
  opacity: 0;
}
</style>
