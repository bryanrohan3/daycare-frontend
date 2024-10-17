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
        <tr
          v-for="booking in bookings"
          :key="booking.id"
          @click="confirmDeleteBooking(booking.id)"
        >
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

    <CustomerBookingModal
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = false"
    />
  </div>
</template>

<script>
import { endpoints, axiosInstance } from "@/helpers/axiosHelper";
import CustomerBookingModal from "@/components/CustomerBookingModal.vue";

export default {
  name: "CustomerBookingsList",
  components: {
    CustomerBookingModal,
  },
  data() {
    return {
      bookings: [],
      isModalVisible: false,
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
    showModal() {
      this.isModalVisible = true;
    },
    confirmDeleteBooking(bookingId) {
      if (confirm(`Do you want to delete booking ID ${bookingId}?`)) {
        this.deleteBooking(bookingId);
      }
    },
    async deleteBooking(bookingId) {
      try {
        await axiosInstance.patch(
          `${endpoints.bookings}${bookingId}/cancel_booking/`
        );
        alert(`Booking ID ${bookingId} has been successfully deleted.`);
        this.bookings = this.bookings.filter(
          (booking) => booking.id !== bookingId
        );
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert(`There was an error deleting booking ID ${bookingId}.`);
      }
    },
  },
};
</script>
