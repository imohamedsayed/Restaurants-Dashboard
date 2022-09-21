<template>
  <LoginForm />
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
export default {
  components: { LoginForm },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>

<style></style>
