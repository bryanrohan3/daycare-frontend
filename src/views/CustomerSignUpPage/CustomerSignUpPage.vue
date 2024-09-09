<template>
  <div class="centre">
    <div class="c-1 mt-30 mb-30">
      <h2 class="h-1 h-center">Welcome to DayCare</h2>
      <p class="p-text-1">Sign up as a new customer</p>
      <form @submit.prevent="createDaycare">
        <p class="h-2">Basic Daycare Details</p>

        <div class="form-row mb-10">
          <div class="form-group">
            <label for="daycare_name">Daycare Name</label>
            <input
              v-model="daycare.name"
              type="text"
              id="daycare_name"
              required
            />
          </div>
        </div>

        <div class="form-row mb-10">
          <div class="form-group">
            <label for="street_address">Street Address</label>
            <input
              v-model="daycare.streetAddress"
              type="text"
              id="street_address"
              required
            />
          </div>
          <div class="form-group">
            <label for="suburb">Suburb</label>
            <input v-model="daycare.suburb" type="text" id="suburb" required />
          </div>
        </div>

        <div class="form-row mb-10">
          <div class="form-group">
            <label for="postcode">Postcode</label>
            <input
              v-model="daycare.postcode"
              type="text"
              id="postcode"
              required
            />
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <input v-model="daycare.state" type="text" id="state" required />
          </div>
        </div>

        <div class="form-row mb-10">
          <div class="form-group">
            <label for="phone">Phone</label>
            <input v-model="daycare.phone" type="text" id="phone" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="daycare.email" type="email" id="email" required />
          </div>
        </div>

        <p class="h-2">Pet Details</p>

        <div class="form-row mb-10">
          <div class="form-group">
            <label for="capacity">Capacity</label>
            <input
              v-model="daycare.capacity"
              type="number"
              id="capacity"
              required
            />
          </div>
          <div class="form-group">
            <label for="pet_types">Pet Types</label>
            <input
              v-model="daycare.petTypes"
              type="text"
              id="pet_types"
              required
            />
          </div>
        </div>

        <p class="h-2">Opening Hours Details</p>

        <div
          v-for="(day, index) in openingHours"
          :key="index"
          class="form-row mb-10"
        >
          <div class="form-group">
            <label :for="'day_' + index">{{ day.name }}</label>
            <input
              v-model="day.fromHour"
              type="time"
              :id="'from_' + index"
              required
            />
          </div>
          <div class="form-group">
            <label :for="'to_' + index">To</label>
            <input
              v-model="day.toHour"
              type="time"
              :id="'to_' + index"
              required
            />
          </div>
          <div class="form-group">
            <label :for="'closed_' + index">Closed</label>
            <input
              v-model="day.closed"
              type="checkbox"
              :id="'closed_' + index"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-group">
          <button class="button button--tertiary" type="submit">
            Create Daycare
          </button>
        </div>
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
