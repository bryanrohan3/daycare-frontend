<template>
  <div>
    <p>Waitlist</p>
    <table class="table">
      <thead>
        <tr class="table-header">
          <th>Customer Name</th>
          <th>Pet Name</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Daycare</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="waitlistItem in waitlist" :key="waitlistItem.booking.id">
          <td>{{ waitlistItem.booking.customer_details.full_name }}</td>
          <td>{{ waitlistItem.booking.pet_details.pet_name }}</td>
          <td>{{ formatDate(waitlistItem.booking.start_time) }}</td>
          <td>{{ formatDate(waitlistItem.booking.end_time) }}</td>
          <td>{{ waitlistItem.booking.daycare }}</td>
        </tr>
        <tr v-if="waitlist.length === 0">
          <td>No waitlist data available</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "Waitlist",
  props: {
    selectedDaycareId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      waitlist: [],
    };
  },
  watch: {
    selectedDaycareId(newDaycareId) {
      if (newDaycareId) {
        this.fetchWaitlist(newDaycareId);
      }
    },
  },
  methods: {
    async fetchWaitlist(daycareId) {
      try {
        const response = await axiosInstance.get(
          `${endpoints.waitlist}?daycare=${daycareId}`
        );
        this.waitlist = response.data;
      } catch (error) {
        console.error("Error fetching waitlist:", error);
      }
    },
    formatDate(dateStr) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    if (this.selectedDaycareId) {
      this.fetchWaitlist(this.selectedDaycareId);
    }
  },
};
</script>
