<template>
  <div class="restCard position-relative">
    <div class="text-center data">
      <h1>
        {{ restaurant.name }}
      </h1>
      <p>{{ restaurant.phone }}</p>
      <p>{{ restaurant.address }}</p>
    </div>
    <div class="actions">
      <button class="bg-secondary text-uppercase" @click="viewRest">
        View
      </button>
      <button class="bg-info text-uppercase" @click="updateRest">Update</button>
      <button class="bg-danger text-uppercase" @click="deleteRest">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["restaurant"],
  methods: {
    deleteRest() {
      this.$emit("delete", this.restaurant.id);
    },
    updateRest() {
      this.$router.push({ name: "update", params: { id: this.restaurant.id } });
    },
    viewRest() {
      this.$router.push({ name: "restaurant", params: { id: this.restaurant.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.restCard {
  background-image: url("../assets/rest2.jpg");
  background-size: cover;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--light);
  gap: 20px;
  border-radius: 20px;
  box-shadow: 5px 5px 2px 1px var(--dark);
  cursor: pointer;
  .data {
    background-color: rgba(white, 0.4);
    width: 80%;
    min-height: 60%;
    border-radius: 15px;
    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: #ffeb3b;
      word-break: break-all;
    }
    p {
      color: var(--dark);
      font-size: 1.3rem;
      font-weight: 700;
      word-break: break-all;
    }
  }
  overflow: hidden;
  &:hover {
    .actions {
      right: 0;
    }
  }
  .actions {
    position: absolute;
    top: 0;
    right: -550px;
    background: rgba(#000, 0.8);
    width: 100%;
    height: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    transition: all 0.8s ease;
    button {
      width: 220px;
      height: 60px;
      color: white;
      border-radius: 20px;
      letter-spacing: 2px;
    }
  }
}
</style>