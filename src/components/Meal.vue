<template>
  <tr>
    <td class="meal-name">{{ item.name }}</td>
    <td class="meal-price p-2 text-success">{{ item.price }}$</td>
    <td class="meal-action p-2">
      <i class="fa-solid fa-trash text-warning" @click="deleteItem"></i>
    </td>
    <td class="meal-action p-2">
      <i class="fa-solid fa-pen" @click="goUpdateItem"></i>
    </td>
  </tr>
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
import Notification from "./Notification.vue";
export default {
  props: ["item"],
  components: { Notification },
  data() {
    return {
      showNotification: false,
      theme: "",
      notify: "",
    };
  },
  methods: {
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.item.id}`
      );

      if (result.status == 200) {
        this.theme = "success";
        this.notify = "Item Removed Successfully";
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
    goUpdateItem() {
      this.$router.push({ name: "updateItem", params: { id: this.item.id } });
    },
  },
};
</script>

<style lang="scss">
tr {
  &:not(:last-of-type) {
    border-bottom: 5px solid black;
  }
  td {
    text-align: center;
    background-color: rgba(119, 119, 119, 0.675);
    word-break: break-all;
    &.meal-name {
      width: 40%;
    }
    &.meal-price {
      width: 30%;
    }
    &.meal-action {
      width: 15%;
      i {
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          transform: scale(1.5);
        }
      }
    }
  }
}
</style>
