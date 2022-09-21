import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import NotFound from "../views/ErrorNotFound.vue";
import UpdatePage from "../views/UpdatePage.vue";
import Restaurant from "../views/Resturant.vue";
import UpdateItem from "../views/UpdateItem.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
    meta: {
      title: "Sign Up",
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      title: "Profile",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },
  },
  {
    path: "/update/:id",
    name: "update",
    component: UpdatePage,
    meta: {
      title: "Update",
    },
    props: true,
  },
  {
    path: "/updateItem/:id",
    name: "updateItem",
    component: UpdateItem,
    meta: {
      title: "Update Item",
    },
    props: true,
  },
  {
    path: "/restaurant/:id",
    name: "restaurant",
    component: Restaurant,
    meta: {
      title: "Restaurant",
    },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Restaurant M.S.`;
  next();
});
export default router;
