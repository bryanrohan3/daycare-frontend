<template>
  <div class="centre">
    <div class="c-1 mt-30 mb-30">
      <h2 class="h-1 h-center">Welcome to DayCare</h2>
      <p class="p-text-1">Sign up as a new customer</p>
      <form @submit.prevent="handleSignUp">
        <!-- Username Alone -->
        <div class="form-group mb-10">
          <label for="username">Username</label>
          <input
            v-model="newUser.username"
            type="text"
            id="username"
            required
          />
        </div>

        <!-- First Name and Last Name Side by Side -->
        <div class="form-row mb-10">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              v-model="newUser.first_name"
              type="text"
              id="firstName"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              v-model="newUser.last_name"
              type="text"
              id="lastName"
              required
            />
          </div>
        </div>

        <!-- Email and Phone Side by Side -->
        <div class="form-row mb-10">
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="newUser.email" type="email" id="email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input v-model="newUser.phone" type="tel" id="phone" required />
          </div>
        </div>

        <!-- Password and Confirm Password Side by Side -->
        <div class="form-row mb-10">
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="newUser.password"
              type="password"
              id="password"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              v-model="newUser.confirmPassword"
              type="password"
              id="confirmPassword"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-group">
          <button class="button button--tertiary" type="submit">Sign Up</button>
        </div>
        <p class="p-text-1">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CustomerSignUpPage",
  data() {
    return {
      newUser: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
      },
    };
  },
  methods: {
    async handleSignUp() {
      // Check if password and confirm password match
      if (this.newUser.password !== this.newUser.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const payload = {
          user: {
            username: this.newUser.username,
            password: this.newUser.password,
            email: this.newUser.email,
            first_name: this.newUser.first_name,
            last_name: this.newUser.last_name,
          },
          phone: this.newUser.phone,
        };

        const response = await axiosInstance.post(
          endpoints.customerSignUp,
          payload
        );
        alert("Sign up successful!");
        this.$router.push({ name: "CustomerHomePage" });
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user. Please try again.");
      }
    },
  },
};
</script>

<style scoped></style>
