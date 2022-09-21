<template>
  <div class="dl-overlay">
    <div class="deleteModal">
      <h1 class="text-center mb-4">Delete All Restaurants</h1>
      <p class="text-danger fw-bold mb-3">
        Are you sure you want to delete All restaurant ...
      </p>
      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary" @click="emitClose">No</button>
        <button class="btn btn-danger" @click="deleteAllRestaurant">Yes</button>
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
import axios from "axios";
import Notification from "../components/Notification.vue";

export default {
  props: ["userId"],
  components: { Notification },
  data() {
    return {
      showNotification: false,
      theme: "",
      notify: "",
      allRests: [],
    };
  },
  async mounted() {
    let result = await axios.get(
      `http://localhost:3000/rests?userId=${this.userId}`
    );
    if (result.status == 200) {
      result.data.forEach((res) => {
        this.allRests.push(res.id);
      });
    } else {
      console.warn("something went wrong");
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    emitClose() {
      this.$emit("closeDelAll");
    },
    async deleteAllRestaurant() {
      let Mainflag = true;
      for (let i = 0; i < this.allRests.length; i++) {
        let allCatResults = await axios.get(
          `http://localhost:3000/categories?restId=${this.allRests[i]}`
        );
        let catIds = [];

        allCatResults.data.forEach((cat) => {
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
        // deleting the restaurant

        let result = await axios.delete(
          `http://localhost:3000/rests/${this.allRests[i]}`
        );
        if (result.status != 200) {
          Mainflag = false;
        }
      }
      if (Mainflag) {
        this.theme = "success";
        this.notify = `Deleted All Resturants Successfully`;
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
  },
};
</script>

<style lang="scss" scoped>
.dl-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.3);
  .deleteModal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    min-width: 450px;
    padding: 40px;
    border-radius: 15px;
    button {
      width: 120px;
      padding: 10px 20px;
    }
  }
}
</style>
