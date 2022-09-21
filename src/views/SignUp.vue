<template>
  <div class="container">
    <SignUpForm />
  </div>
</template>

<script>
import SignUpForm from "@/components/SignUpForm.vue";
export default {
  components: { SignUpForm },
  mounted() {
    let user = localStorage.getItem("user");
    if (user) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>

<style></style>
