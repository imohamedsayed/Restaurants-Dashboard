<template>
  <header>
    <div class="container">
      <div class="row align-items-center justify-content-between">
        <div class="col-md-9 col-12">
          <div class="user-details d-flex">
            <div class="img">
              <img src="../assets/user.jpg" alt="" />
            </div>
            <div class="details">
              <h3>{{ userName }}</h3>
              <p>{{ userEmail }}</p>
            </div>
          </div>
        </div>
        <div class="col-3 d-md-block d-none">
          <div class="edit">
            <button @click="$router.push({ name: 'profile' })">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      userEmail: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.push({ name: "login" });
    } else {
      this.userInfo = JSON.parse(localStorage.getItem("user"));
      this.userName = this.userInfo.name;
      this.userEmail = this.userInfo.email;
    }
  },
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  min-height: 60px;
  background-color: var(--dark-alt);
  padding: 5px 0;
  padding-top: 10px;
  .row {
    height: 80px;
    align-items: center;
    > div {
      height: 80px;
    }
    .user-details {
      align-items: center;
      gap: 15px;
      .img {
        border-radius: 50px;
        text-align: center;
        width: 80px !important;
        padding: 4px;
        background-color: #848b966d;
        img {
          border-radius: 50px;

          width: 70px;
        }
      }
      .details {
        line-height: 1.4;
        color: var(--light);
        h3 {
          font-size: 1.2rem;
        }
      }
    }
    .edit {
      display: flex;
      justify-content: end;
      align-items: center;
      height: 100%;
      button {
        width: 120px;
        padding: 10px 20px;
        background-color: var(--primary);
        border-radius: 10px;
        color: var(--light);
        transition: all 0.3s ease;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
</style>
