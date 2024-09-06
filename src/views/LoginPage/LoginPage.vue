<template>
  <div class="centre">
    <div class="c-1">
      <h2 class="h-1">Welcome to DayCare</h2>
      <form @submit.prevent="handleLogin">
        <div
          v-for="(field, index) in formFields"
          :key="index"
          class="form-group mb-10"
        >
          <label :for="field.id">{{ field.label }}</label>
          <input
            v-model="formData[field.model]"
            :type="field.type"
            :id="field.id"
            :required="field.required"
          />
        </div>
        <div class="form-group mb-10">
          <button class="button button--tertiary" type="submit">Login</button>
        </div>
        <p class="p-text-1">
          New Customer? <router-link to="/signup">Register</router-link>
        </p>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { loginFormFields } from "@/config/formFieldConfig";

export default {
  name: "LoginPage",
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      errorMessage: "",
      formFields: loginFormFields,
    };
  },
  methods: {
    async handleLogin() {
      console.log("Logging Attempt:", this.formData.username);
      console.log("Password Attempt:", this.formData.password);
      try {
        const response = await axiosInstance.post(
          endpoints.login,
          this.formData
        );
        console.log("Login response ->", response.data);

        const { token, user } = response.data;

        // Storing the user's token and User Profile in the Store
        this.setAuthToken(token);
        this.setUserProfile(user);
        this.setUserAccountType(user.account_type);

        console.log(
          "Login Successful, Redirecting to Screen based on user Role: ",
          user.account_type
        );
        setTimeout(() => {
          if (user.account_type === "staff") {
            this.$router.push({ name: "StaffDashboardPage" });
          } else if (user.account_type === "customer") {
            this.$router.push({ name: "CustomerHomePage" });
          } else {
            this.errorMessage = "Invalid User Type";
          }
        }, 500);
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "Invalid Username or Password";
      }
    },
    ...mapMutations(["setAuthToken", "setUserProfile", "setUserAccountType"]),
  },
};
</script>

<style scoped>
@import "@/utils/buttons.scss";
@import "@/utils/containers.scss";
@import "@/utils/headings.scss";
@import "@/utils/form.scss";
@import "@/utils/margins.scss";

/* Optional additional styles if needed */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
