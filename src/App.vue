<template>
  <SideBar v-if="showNav" />
  <main>
    <router-view />
  </main>
</template>
<script>
import SideBar from "./components/SideBar.vue";
export default {
  name: "App",
  components: { SideBar },
  data() {
    return {
      showNav: JSON.parse(localStorage.getItem("user")) ? true : false,
    };
  },
  methods: {
    watchAside() {
      this.showNav = JSON.parse(localStorage.getItem("user")) ? true : false;
    },
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => this.watchAside()
    );
  },
};
</script>
<style lang="scss">
:root {
  --primary: #4ade80;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --menu: #a19553;
  --sidebar-width: 300px;
}
@mixin styleInput {
  width: 100%;
  border: none;
  outline: none;
  padding: 10px 5px;
  padding-bottom: 10px;
  border-bottom: 1.5px solid #444;
  margin: 10px 0;
  &::placeholder {
    color: #cfcfcf;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: var(--light);
  overflow-x: hidden;
}
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  main {
    flex: 1 1 0;
    height: 100vh;
    overflow-y: auto;
    @media (max-width: 768px) {
      padding-left: 4rem;
    }
  }
}
</style>
