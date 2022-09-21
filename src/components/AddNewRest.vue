<template>
  <div class="addBox">
    <i class="fa-solid fa-circle-plus" @click="toggleAddition"></i>
    <p>Add Restaurant</p>
  </div>
  <teleport to="body">
    <AddRestForm @close="toggleAddition" :showAdd="showAdd" />
  </teleport>
</template>

<script>
import AddRestForm from "./AddRestForm.vue";
export default {
  components: { AddRestForm },
  data() {
    return {
      showAdd: false,
    };
  },
  methods: {
    toggleAddition() {
      this.showAdd = !this.showAdd;
    },
  },
};
</script>

<style lang="scss" scoped>
.addBox {
  background: var(--dark);
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--light);
  gap: 20px;
  border-radius: 20px;
  box-shadow: 5px 5px 2px 1px var(--grey);
  transition: all 0.5s ease;
  &:hover {
    background: var(--dark-alt);
  }
  i {
    display: block;
    font-size: 4rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 50px;
    &:hover {
      transform: scale(1.06);
      box-shadow: 2px 2px 4px 1px var(--grey);
    }
  }
  p {
    font-size: 2rem;
    letter-spacing: 2px;
  }
}
</style>
