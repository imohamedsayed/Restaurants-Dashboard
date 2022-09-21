<template>
  <div class="notFound">
    <div class="continer">
      <h1 class="text-center">404</h1>
      <h1 class="text-center">Page Not Found</h1>
      <div class="text-center mt-5">
        <button @click="$router.push({ name: 'home' })">Back To Home</button>
      </div>
      <img src="../assets/error.png" class="img-fluid" alt="" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: { Header },
};
</script>

<style lang="scss" scoped>
.notFound {
  .continer {
    h1 {
      font-size: 3rem;
      font-weight: bold;
    }
    h1:first-of-type {
      color: var(--primary);
      font-size: 5rem;
    }
    button {
      background-color: var(--primary);
      width: 400px;
      height: 50px;
      border-radius: 20px;
      color: var(--light);
      font-size: 1.5rem;
    }
    img {
      width: 80%;
      display: block;
      margin: 0 auto;
      height: 600px;
    }
  }
}
</style>
