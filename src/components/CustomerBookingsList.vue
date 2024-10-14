<template>
  <div>
    <div class="flex-row-space">
      <button @click="showModal" class="button button--tertiary mt-5 pad-5">
        Add Booking
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="table-header">Booking ID</th>
          <th class="table-header">Start Date</th>
          <th class="table-header">End Date</th>
          <th class="table-header">Daycare</th>
          <th class="table-header">Customer Name</th>
          <th class="table-header">Pet Name</th>
          <th class="table-header">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{ booking.id }}</td>
          <td>{{ booking.start_time }}</td>
          <td>{{ booking.end_time }}</td>
          <td>{{ booking.daycare }}</td>
          <td>{{ booking.customer_details.full_name }}</td>
          <td>{{ booking.pet_details.pet_name }}</td>
          <td>{{ booking.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { endpoints, axiosInstance } from "@/helpers/axiosHelper";

export default {
  name: "CustomerBookingsList",
  data() {
    return {
      bookings: [],
    };
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        const response = await axiosInstance.get(endpoints.bookings);
        this.bookings = response.data;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
  },
};
</script>
