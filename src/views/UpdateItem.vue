<template>
  <Header />
  <div class="container mt-5 py-3">
    <form @submit.prevent="updateItem">
      <h1 class="text-center text-light mb-4">
        Update <span class="text-warning">{{ name }}</span> Data
      </h1>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Name </label>
        <input
          type="text"
          placeholder="Type your restaurant name .."
          v-model="itemName"
        />
      </div>
      <p class="text-danger fw-bold" v-if="v$.itemName.$error">
        {{ v$.itemName.$errors[0].$message }}
      </p>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Description </label>
        <input
          type="text"
          placeholder="Type your restaurant phone number.."
          v-model="itemDesc"
        />
        <p class="text-danger fw-bold" v-if="v$.itemDesc.$error">
          {{ v$.itemDesc.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Price </label>
        <input
          type="number"
          placeholder="Type your restaurant address .."
          v-model="itemPrice"
        />
        <p class="text-danger fw-bold" v-if="v$.itemPrice.$error">
          {{ v$.itemPrice.$errors[0].$message }}
        </p>
      </div>
      <div class="input-field mt-b-md-3 mt-5">
        <label class="d-block">Quantity </label>
        <input
          type="number"
          placeholder="Type your restaurant address .."
          v-model="itemQty"
        />
        <p class="text-danger fw-bold" v-if="v$.itemQty.$error">
          {{ v$.itemQty.$errors[0].$message }}
        </p>
      </div>
      <div class="submit text-center">
        <button>Update</button>
      </div>
    </form>
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
import Header from "@/components/Header.vue";
import Notification from "@/components/Notification.vue";
import useValidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  decimal,
  integer,
} from "@vuelidate/validators";
import axios from "axios";
export default {
  props: ["id"],
  components: { Header, Notification },
  data() {
    return {
      v$: useValidate(),
      itemName: "",
      itemDesc: "",
      itemPrice: 0,
      itemQty: 0,
      showNotification: false,
      theme: "",
      notify: "",
      item: {},
      userId: 0,
      name: "",
      catId: "",
      existedItemsNames: [],
    };
  },
  validations() {
    return {
      itemName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
      itemDesc: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(100),
      },
      itemPrice: {
        required,
        decimal,
      },
      itemQty: {
        required,
        integer,
      },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.push({ name: "login" });
    } else {
      this.userId = JSON.parse(user).id;
      let result = await axios.get(`http://localhost:3000/items/${this.id}`);
      if (result.status == 200) {
        this.item = result.data;
        if (this.item.userId != this.userId) {
          this.$router.push({ name: "home" });
        }
        this.itemName = this.item.name;
        this.name = this.item.name;
        this.itemDesc = this.item.description;
        this.itemPrice = this.item.price;
        this.itemQty = this.item.qty;
        this.catId = this.item.catId;
      } else {
        console.warn("SomeThing Went Wrong");
      }
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    async updateItem() {
      this.v$.$validate();

      if (!this.v$.$error) {
        let allCatitems = await axios.get(
          `http://localhost:3000/items?catId=${this.catId}`
        );
        if (allCatitems.status == 200 && allCatitems.data.length > 0) {
          allCatitems.data.forEach((i) => {
            this.existedItemsNames.push({ name: i.name, id: i.id });
          });

          for (let i = 0; i < this.existedItemsNames.length; i++) {
            if (
              this.existedItemsNames[i].name.toLowerCase().trim() ===
                this.itemName.toLowerCase().trim() &&
              this.existedItemsNames[i].id != this.id
            ) {
              this.theme = "error";
              this.notify = `${this.itemName} Is Already Existed !`;
              this.showNotification = true;
              setTimeout(() => {
                this.showNotification = false;
              }, 2000);
              return;
            }
          }
          let result = await axios.put(
            `http://localhost:3000/items/${this.id}`,
            {
              name: this.itemName.trim(),
              price: this.itemPrice,
              description: this.itemDesc.trim(),
              qty: this.itemQty,
              catId: this.catId,
              userId: this.userId,
            }
          );
          if (result.status == 200) {
            this.theme = "success";
            this.notify = `Updated Successfully`;
            this.showNotification = true;
            setTimeout(() => {
              this.showNotification = false;
              location.reload();
            }, 2000);
          } else {
            this.theme = "error";
            this.notify = `Something went wrong try again`;
            this.showNotification = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 2000);
          }
        } else {
          console.warn(
            "Some thing went wrong while getting all category items"
          );
        }
      } else {
        this.theme = "error";
        this.notify = `Error in item Data !`;
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  background: linear-gradient(to right, #1e293b, #334155);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 8px 14px 20px 1px var(--grey);
  margin-bottom: 40px;
  .input-field {
    &:not(:last-of-type) {
      margin-bottom: 40px;
    }
    label {
      font-size: 1.8rem;
      margin-bottom: 2px;
      color: var(--grey);
      span {
        font-size: 1.2rem;
      }
    }
    input {
      width: 100%;
      height: 50px;
      font-size: 1.3rem;
      background-color: transparent;
      color: var(--light);
      border: none;
      outline: none;
      padding: 10px 5px;
      padding-bottom: 10px;
      border-bottom: 4px solid #444;
      margin: 10px 0;
      &::placeholder {
        color: #cfcfcf53;
      }
    }
  }
  button {
    background-color: var(--primary);
    width: 120px;
    padding: 10px 20px;
    border-radius: 10px;
    color: var(--light);
  }
}
</style>
