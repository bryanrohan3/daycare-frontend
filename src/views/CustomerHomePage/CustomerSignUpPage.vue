<template>
  <div class="centre">
    <div class="c-1 c-1-wide mt-30 mb-30">
      <h2 class="h-1">Welcome to DayCare</h2>
      <p class="p-text-1">Sign up as a new customer</p>
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input v-model="firstName" type="text" id="firstName" required />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input v-model="lastName" type="text" id="lastName" required />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input v-model="phone" type="tel" id="phone" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            required
          />
        </div>
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
export default {
  name: "CustomerSignUpPage",
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    handleSignUp() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      // TODO: Handle Cusotmer Signup
      // endpoint is customer-profile
      // post.(endpoint.customer-sign-up)
      // redirect to customer side
    },
  },
};
</script>

<style scoped>
/* Your existing styles here */
</style>
