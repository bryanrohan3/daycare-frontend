<template>
  <div>
    <p class="h-1">Create Daycare</p>

    <form @submit.prevent="createDaycare">
      <p class="h-2">Basic Daycare Details</p>

      <div class="form-row mb-10">
        <!-- Daycare Name on one row -->
        <div class="form-group">
          <label for="daycare_name">Daycare Name</label>
          <input
            v-model="form.daycare_name"
            type="text"
            id="daycare_name"
            required
          />
        </div>
      </div>

      <div class="form-row mb-10">
        <!-- Street Address and Suburb on same row -->
        <div class="form-group">
          <label for="street_address">Street Address</label>
          <input
            v-model="form.street_address"
            type="text"
            id="street_address"
            required
          />
        </div>
        <div class="form-group">
          <label for="suburb">Suburb</label>
          <input v-model="form.suburb" type="text" id="suburb" required />
        </div>
      </div>

      <div class="form-row mb-10">
        <!-- Postcode and State on same row -->
        <div class="form-group">
          <label for="postcode">Postcode</label>
          <input v-model="form.postcode" type="text" id="postcode" required />
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <select v-model="form.state" id="state" required>
            <option
              v-for="option in stateOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <!-- Phone and Email on same row -->
        <div class="form-group">
          <label for="phone">Phone</label>
          <input v-model="form.phone" type="text" id="phone" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" type="email" id="email" required />
        </div>
      </div>

      <p class="h-2">Pet Details</p>

      <div class="form-row">
        <!-- Capacity and Pet Types on same row -->
        <div class="form-group">
          <label for="capacity">Capacity</label>
          <input v-model="form.capacity" type="number" id="capacity" required />
        </div>
        <div class="form-group">
          <label for="pet_types">Pet Types</label>
          <input v-model="form.pet_types" type="text" id="pet_types" />
        </div>
      </div>

      <p class="h-2">Opening Hours Details</p>

      <div v-for="(day, index) in openingHours" :key="index" class="form-row">
        <!-- Monday to Sunday one row each -->
        <div class="form-group mb-10">
          <label for="day">Day</label>
          <select v-model="day.day" id="day" disabled>
            <option
              v-for="option in dayOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="form-group mb-10">
          <label for="from_hour">From Hour</label>
          <input v-model="day.from_hour" type="time" id="from_hour" />
        </div>
        <div class="form-group mb-10">
          <label for="to_hour">To Hour</label>
          <input v-model="day.to_hour" type="time" id="to_hour" />
        </div>
        <div class="form-group mb-10">
          <label for="closed">Closed</label>
          <input v-model="day.closed" type="checkbox" id="closed" />
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
</template>

<script>
export default {
  name: "CreateDaycarePage",
  data() {
    return {
      form: {
        daycare_name: "",
        street_address: "",
        suburb: "",
        postcode: "",
        state: "",
        phone: "",
        email: "",
        capacity: "",
        pet_types: "",
      },
      openingHours: [
        { day: 1, from_hour: "", to_hour: "", closed: false },
        { day: 2, from_hour: "", to_hour: "", closed: false },
        { day: 3, from_hour: "", to_hour: "", closed: false },
        { day: 4, from_hour: "", to_hour: "", closed: false },
        { day: 5, from_hour: "", to_hour: "", closed: false },
        { day: 6, from_hour: "", to_hour: "", closed: false },
        { day: 7, from_hour: "", to_hour: "", closed: false },
      ],
      stateOptions: [
        { value: "", text: "Select State" },
        { value: "NSW", text: "New South Wales" },
        { value: "VIC", text: "Victoria" },
        { value: "QLD", text: "Queensland" },
        { value: "SA", text: "South Australia" },
        { value: "WA", text: "Western Australia" },
        { value: "TAS", text: "Tasmania" },
        { value: "NT", text: "Northern Territory" },
        { value: "ACT", text: "Australian Capital Territory" },
      ],
      dayOptions: [
        { value: 1, text: "Monday" },
        { value: 2, text: "Tuesday" },
        { value: 3, text: "Wednesday" },
        { value: 4, text: "Thursday" },
        { value: 5, text: "Friday" },
        { value: 6, text: "Saturday" },
        { value: 7, text: "Sunday" },
      ],
    };
  },
  methods: {
    createDaycare() {
      // Handle the form submission logic here
      console.log(this.form);
      console.log(this.openingHours);
    },
  },
};
</script>
