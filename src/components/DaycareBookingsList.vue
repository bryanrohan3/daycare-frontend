<!-- Need to make this page a componenet as it is reusing same code in HandleEmployeeRoster -->
<template>
  <div>
    <div class="flex-row-space">
      <DateSelector @apply="updateWeekFromDate" />
    </div>

    <div class="flex-row-space mb-20 mt-20">
      <button @click="changeWeek(-1)" class="button button--tertiary">
        ← Last Week
      </button>
      <button @click="changeWeek(1)" class="button button--tertiary">
        Next Week →
      </button>
    </div>

    <div class="flex-row-space mb-20">
      <div v-for="(date, index) in weekDates" :key="index" class="day-header">
        {{ date.day }}<br />{{ date.date }}
      </div>
    </div>

    <div class="flex-row-space">
      <div v-for="(date, index) in weekDates" :key="index" class="day-column">
        <div class="shift-container">
          <div v-if="groupedBookings[date.fullDate]?.length">
            <div
              v-for="booking in groupedBookings[date.fullDate]"
              :key="booking.id"
              class="shift-card"
              :class="{
                'current-user-shift': booking.checked_in === true,
              }"
            >
              <p class="bold">
                {{ formatBookingTime(booking.start_time, booking.end_time) }}
              </p>
              <p>C: {{ booking.customer_details.full_name }}</p>
              <p>P: {{ booking.pet_details.pet_name }}</p>
              <p class="bold">S: {{ booking.status }}</p>
            </div>
          </div>
          <div v-else class="fs-12 text-center">No Bookings</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import DateSelector from "@/components/DateSelector.vue";
import { fetchCurrentStaffProfile } from "@/helpers/fetchCurrentStaffProfile";

export default {
  name: "HandleDaycareBookings",
  components: {
    DateSelector,
  },
  props: {
    selectedDaycareId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      bookingData: [],
      daycareId: null,
      startOfWeek: new Date(),
      errorMessage: "",
    };
  },
  computed: {
    weekDates() {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(this.startOfWeek);
        date.setDate(this.startOfWeek.getDate() + i);
        return {
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          fullDate: date.toISOString().split("T")[0],
        };
      });
    },
    groupedBookings() {
      return this.bookingData.reduce((acc, booking) => {
        const dateKey = booking.start_time.split("T")[0]; // Group by date
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(booking);
        return acc;
      }, {});
    },
  },
  methods: {
    async fetchBookingData() {
      try {
        if (!this.daycareId) return;

        const [weekStart, weekEnd] = [
          this.weekDates[0].fullDate,
          this.weekDates[6].fullDate,
        ];
        const response = await axiosInstance.get(
          `${endpoints.bookings}?daycare=${this.daycareId}&start_date=${weekStart}&end_date=${weekEnd}`
        );
        this.bookingData = response.data;
      } catch (error) {
        console.error("Error fetching booking data:", error);
        this.errorMessage = "Failed to fetch bookings. Please try again.";
      }
    },
    changeWeek(direction) {
      const newStartOfWeek = new Date(this.startOfWeek);
      newStartOfWeek.setDate(newStartOfWeek.getDate() + direction * 7);
      this.startOfWeek = newStartOfWeek;
      this.fetchBookingData();
    },
    updateWeekFromDate(date) {
      const selectedDate = new Date(date);
      const mondayOffset =
        selectedDate.getDay() === 0 ? -6 : 1 - selectedDate.getDay();
      this.startOfWeek = new Date(selectedDate);
      this.startOfWeek.setDate(selectedDate.getDate() + mondayOffset);
      this.fetchBookingData();
    },
    formatBookingTime(start, end) {
      return `${this.formatTime(start)} - ${this.formatTime(end)}`;
    },
    formatTime(date) {
      return new Date(date).toISOString().substring(11, 16);
    },
  },
  async mounted() {
    try {
      const profile = await fetchCurrentStaffProfile();
      this.daycareId = this.selectedDaycareId;
      await this.fetchBookingData();
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  },
  watch: {
    selectedDaycareId(newId) {
      this.daycareId = newId;
      this.fetchBookingData();
    },
  },
};
</script>

<style scoped>
@import "@/utils/roster.scss";
</style>
