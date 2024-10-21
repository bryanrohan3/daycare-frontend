<template>
  <div>
    <p>Waitlist</p>
    <table class="table">
      <thead>
        <tr class="table-header">
          <th v-if="isStaff">Customer Name</th>
          <th>Pet Name</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Daycare</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="waitlistItem in waitlist" :key="waitlistItem.booking.id">
          <td v-if="isStaff">
            {{ waitlistItem.booking.customer_details.full_name }}
          </td>
          <td>{{ waitlistItem.booking.pet_details.pet_name }}</td>
          <td>{{ formatDate(waitlistItem.booking.start_time) }}</td>
          <td>{{ formatDate(waitlistItem.booking.end_time) }}</td>
          <td>{{ waitlistItem.booking.daycare }}</td>

          <td v-if="isStaff">
            <button
              class="button button--tertiary"
              @click="confirmInvite(waitlistItem)"
            >
              Invite
            </button>
          </td>

          <td v-if="isCustomer && waitlistItem.customer_notified">
            <button
              class="button button--tertiary"
              @click="acceptBooking(waitlistItem.id)"
            >
              Accept
            </button>
          </td>
        </tr>
        <tr v-if="waitlist.length === 0">
          <td colspan="6">No waitlist data available</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { mapGetters } from "vuex";

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
      if (newDaycareId && this.isStaff) {
        this.fetchWaitlist(newDaycareId);
      }
    },
  },
  computed: {
    ...mapGetters(["getUserAccountType"]),
    isStaff() {
      return this.getUserAccountType === "staff";
    },
    isCustomer() {
      return this.getUserAccountType === "customer";
    },
  },
  methods: {
    async fetchWaitlist(daycareId = null) {
      try {
        let response;

        // Fetch waitlist for customers (all data)
        if (this.isCustomer) {
          response = await axiosInstance.get(`${endpoints.waitlist}`);
        }
        // Fetch waitlist for staff (based on daycareId)
        else if (this.isStaff && daycareId) {
          response = await axiosInstance.get(
            `${endpoints.waitlist}?daycare=${daycareId}`
          );
        }

        this.waitlist = response ? response.data : [];
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

    async confirmInvite(waitlistItem) {
      const confirmed = confirm(
        `Are you sure you want to overbook on ${this.formatDate(
          waitlistItem.booking.start_time
        )}?`
      );

      if (confirmed) {
        try {
          const waitlistId = waitlistItem.id;
          await axiosInstance.patch(
            `${endpoints.waitlist}${waitlistId}/notify_customer/`
          );

          this.fetchWaitlist(this.selectedDaycareId);
        } catch (error) {
          console.error("Error notifying customer:", error);
        }
      }
    },
    async acceptBooking(waitlistId) {
      try {
        await axiosInstance.patch(
          `${endpoints.waitlist}${waitlistId}/accept_booking/`
        );
        this.fetchWaitlist();
      } catch (error) {
        console.error("Error accepting booking:", error);
      }
    },
  },

  mounted() {
    if (this.isCustomer) {
      this.fetchWaitlist();
    } else if (this.isStaff && this.selectedDaycareId) {
      this.fetchWaitlist(this.selectedDaycareId);
    }
  },
};
</script>
