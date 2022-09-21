<template>
  <Header />
  <div class="restaurant">
    <div class="restPreview d-lg-flex d-none">
      <div class="img-box p-2">
        <img src="../assets/rest3.jpg" class="img-fluid" alt="" />
      </div>
      <div class="data-box">
        <label class="d-block">Name :</label>
        <h3>{{ restName }}</h3>
      </div>
      <div class="data-box">
        <label class="d-block">Phone :</label>
        <h3>{{ restPhone }}</h3>
      </div>
      <div class="data-box">
        <label class="d-block">Address :</label>
        <h3>{{ restAddress }}</h3>
      </div>
    </div>
    <div class="menu position-relative">
      <div class="menu-content">
        <h1 class="text-center text-warning">Menu</h1>
        <div class="row px-4 mt-5">
          <div
            class="col-lg-4 col-md-6 col-12"
            v-for="cat in categories"
            :key="cat.id"
          >
            <CategoryCard :category="cat" :restaurant="restaurant" />
          </div>
        </div>
        <div class="text-center mt-4 mb-3">
          <button class="btn btn-warning" @click="showAddition = true">
            Add New Category
          </button>
          <button class="btn btn-danger ms-4" @click="deleteAllCategories">
            Delete All Categories
          </button>
        </div>
      </div>
    </div>
  </div>
  <AddCategory
    :restaurant="restaurant"
    :showAddition="showAddition"
    @closeAdd="showAddition = false"
  />
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
import Notification from "../components/Notification.vue";
import axios from "axios";
import CategoryCard from "../components/CategoryCard.vue";
import AddCategory from "@/components/AddCategory.vue";

export default {
  components: { Header, Notification, CategoryCard, AddCategory },
  props: ["id"],
  data() {
    return {
      restName: "",
      restPhone: "",
      restAddress: "",
      userId: "",
      showNotification: false,
      theme: "",
      notify: "",
      categories: [],
      restaurant: "",
      showAddition: false,
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
        this.restaurant = restaurant;
        this.restName = restaurant.name;
        this.restPhone = restaurant.phone;
        this.restAddress = restaurant.address;
      } else {
        console.warn("SomeThing Went Wrong");
      }
    }

    let catResults = await axios.get(
      `http://localhost:3000/categories?restId=${this.id}`
    );
    if (catResults.status == 200 && catResults.data.length > 0) {
      this.categories = catResults.data;
    } else {
      //console.log("Something Went Wrong or No data Found");
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async deleteAllCategories() {
      let catIds = [];

      this.categories.forEach((cat) => {
        catIds.push(cat.id);
      });

      let itemIds = [];

      for (let i = 0; i < catIds.length; i++) {
        let itemResult = await axios.get(
          `http://localhost:3000/items?catId=${catIds[i]}`
        );
        itemResult.data.forEach((item) => {
          itemIds.push(item.id);
        });
      }
      // now delete the items
      let flag = true;
      for (let i = 0; i < itemIds.length; i++) {
        let deleteItem = await axios.delete(
          `http://localhost:3000/items/${itemIds[i]}`
        );

        if (deleteItem.status != 200) {
          flag = false;
        }
      }
      if (!flag) {
        this.theme = "error";
        this.notify =
          "Something Went Wrong while deleting res. menu items, try again...";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
        return;
      }
      // delete categories
      for (let i = 0; i < catIds.length; i++) {
        let deleteCat = await axios.delete(
          `http://localhost:3000/categories/${catIds[i]}`
        );

        if (deleteCat.status != 200) {
          flag = false;
        }
      }
      if (!flag) {
        this.theme = "error";
        this.notify =
          "Something Went Wrong while deleting res. menu category, try again...";
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
        return;
      }

      this.theme = "success";
      this.notify = "All Categories Have Been Deleted Successfully";
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
        location.reload();
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.restaurant {
  display: flex;
  padding-top: 1px;
  .restPreview {
    min-height: calc(100vh - 96px);
    width: 340px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 5px 10px;
    @media (max-width: 1414px) {
      display: none !important;
    }
    background: url("../assets/menu2.jpg");
    background-size: cover;
    .img-box {
      background-color: var(--dark);
      img {
        box-shadow: 0 0 5px 4px #111;
      }
    }
    .data-box {
      label {
        font-size: 1.7rem;
        color: var(--light);
      }
      h3 {
        font-size: 2rem;
        color: var(--menu);
        letter-spacing: 2px;
      }
    }
  }
  .menu {
    flex: 1 1 0;
    min-height: calc(100vh - 96px);
    background: url("../assets/menu.jpg");
    background-size: cover;
    .menu-content {
      position: absolute;
      background-color: rgba(#000, 0.4);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px; /* for vertical scroll */
        height: 12px; /* for horizontal scroll */
      }

      &::-webkit-scrollbar-thumb {
        background: var(--menu);
        border-radius: 20px;
      }
      h1 {
        padding: 10px 0;
        margin: 0;
        font-size: 3rem;
        letter-spacing: 2px;
        margin-bottom: 20px;
        background-color: rgba(119, 119, 119, 0.183);
      }
    }
  }
}
</style>
