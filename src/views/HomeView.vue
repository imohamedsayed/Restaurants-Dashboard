<template>
  <div class="home">
    <Header class="mb-5" />
    <div class="container pt-5">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-12 mb-4">
          <AddNewRest />
        </div>
        <div
          class="col-lg-4 col-md-6 col-12 mb-4"
          v-for="rest in restaurants"
          :key="rest.id"
        >
          <RestCard :restaurant="rest" @delete="deleteRest" />
        </div>
      </div>
      <div class="text-center">
        <button
          class="btn btn-danger"
          @click="toggleDeleteAll"
          v-if="restaurants.length > 1"
        >
          Delete All Restaurants ({{ restaurants.length }})
        </button>
      </div>
    </div>
  </div>
  <teleport to="body">
    <Modal @close="toggleModal" :modalActive="modalActive">
      <h2>
        No Restaurants Found, Add your restaurant so you can view and update it
      </h2>
    </Modal>
    <DeleteModal
      v-if="showDelete"
      :userId="userId"
      @closeDel="toggleDelete"
      :id="deletedRestId"
    />
    <DeleteAll
      @closeDelAll="toggleDeleteAll"
      :userId="userId"
      v-if="showDeleteAll"
    />
  </teleport>
</template>

<script>
import Header from "@/components/Header.vue";
import AddNewRest from "@/components/AddNewRest.vue";
import axios from "axios";
import RestCard from "@/components/RestCard.vue";
import Modal from "../components/Modal.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import DeleteAll from "@/components/DeleteAll.vue";

// @ is an alias to /src

export default {
  name: "HomeView",
  components: { Header, AddNewRest, RestCard, Modal, DeleteModal, DeleteAll },
  data() {
    return {
      userName: "",
      userEmail: "",
      userId: "",
      showDelete: false,
      showDeleteAll: false,
      restaurants: [],
      modalActive: false,
      see: localStorage.getItem("see") === "false",
      deletedRestId: null,
    };
  },
  async mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.push({ name: "login" });
    } else {
      this.userInfo = JSON.parse(localStorage.getItem("user"));
      this.userName = this.userInfo.name;
      this.userEmail = this.userInfo.email;
      this.userId = this.userInfo.id;
    }

    let result = await axios.get(
      `http://localhost:3000/rests?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      this.restaurants = result.data;
    } else {
      if (this.see) {
        this.toggleModal();
        localStorage.setItem("see", true);
      }
    }
  },
  methods: {
    toggleDelete() {
      this.showDelete = !this.showDelete;
    },
    toggleDeleteAll() {
      this.showDeleteAll = !this.showDeleteAll;
    },
    deleteRest(id) {
      this.deletedRestId = id;
      this.showDelete = true;
    },
    toggleModal() {
      console.log("clicked");
      this.modalActive = !this.modalActive;
    },
  },
};
</script>
<style lang="scss" scoped></style>
