<template>
  <div>
    <h2>Welcome to DayDare</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      console.log("Logging Attempt:", this.username);
      console.log("Password Attempt:", this.password);
      console.log("Token: ", this.token);
      try {
        const response = await axiosInstance.post(endpoints.login, {
          username: this.username,
          password: this.password,
        });
        console.log("Login response ->", response.data);

        const { token, user } = response.data;

        // Storing the user's token and User Profile in the Store
        this.setAuthToken(token);
        this.setUserProfile(user);
        this.setUserAccountType(user.account_type); // Fixed the method call

        console.log(
          "Login Successful, Redirecting to Screen based on user Role: ",
          user.account_type
        );
        setTimeout(() => {
          if (user.account_type === "staff") {
            this.$router.push({ name: "StaffDashboardPage" });
          } else if (user.account_type === "customer") {
            this.$router.push({ name: "CustomerHomePage" }); // Corrected route name
          } else {
            this.errorMessage = "Invalid User Type";
          }
        }, 500);
      } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        this.errorMessage = "Invalid Username or Password"; // You can refine this based on the error response
      }
    },
    ...mapMutations(["setAuthToken", "setUserProfile", "setUserAccountType"]),
  },
};
</script>
