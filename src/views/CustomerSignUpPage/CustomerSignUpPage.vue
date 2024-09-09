<template>
  <div class="centre">
    <div class="c-1 mt-30 mb-30">
      <h2 class="h-1 h-center">Welcome to DayCare</h2>
      <p class="p-text-1">Sign up as a new customer</p>
      <form @submit.prevent="handleSignUp">
        <div v-for="(field, index) in formFields" :key="index">
          <!-- Render the form group based on the field configuration -->
          <div :class="['form-group', field.row ? 'mb-10' : '']">
            <label class="mt-10" :for="field.id">{{ field.label }}</label>
            <input
              v-model="newUser[field.model]"
              :type="field.type"
              :id="field.id"
              :required="field.required"
            />
          </div>
        </div>

        <div class="form-row mb-10" v-if="showPasswordFields">
          <!-- Password and Confirm Password Side by Side -->
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
import { signUpFormField } from "@/config/formFieldConfig";

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
      formFields: signUpFormField,
      showPasswordFields: true,
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
