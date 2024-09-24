<template>
  <div>
    <!-- Form to Add Unavailability -->
    <form @submit.prevent="addUnavailability">
      <div class="form-row">
        <div class="form-group">
          <label for="day-of-week">Day of Week:</label>
          <select v-model="newUnavailability.day_of_week">
            <option value="" disabled>Select Day</option>
            <option
              v-for="(day, index) in daysOfWeek"
              :key="index"
              :value="index"
            >
              {{ day }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" v-model="newUnavailability.date" />
        </div>
      </div>

      <div class="form-group">
        <label for="is-recurring">Is Recurring:</label>
        <select v-model="newUnavailability.is_recurring">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <button type="submit" class="button button--tertiary mt-10">
        Add Unavailability
      </button>
    </form>

    <div
      v-if="message"
      :class="messageType === 'success' ? 'success' : 'error'"
      class="mt-10"
    >
      {{ message }}
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Staff Name</th>
          <th>Type</th>
          <th>Date/Day of Week</th>
          <th>Recurring</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in unavailabilities" :key="index">
          <td>{{ item.staff.first_name }} {{ item.staff.last_name }}</td>
          <td>{{ item.type }}</td>
          <td v-if="item.type === 'Specific Date'">{{ item.date }}</td>
          <td v-if="item.type === 'Day of Week'">
            {{ daysOfWeek[item.day_of_week] }}
          </td>
          <td>{{ item.is_recurring ? "Yes" : "No" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { endpoints, axiosInstance } from "@/helpers/axiosHelper";

export default {
  data() {
    return {
      newUnavailability: {
        day_of_week: null,
        date: null,
        is_recurring: false,
      },
      unavailabilities: [],
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      message: "",
      messageType: "",
    };
  },
  methods: {
    async fetchUnavailabilities() {
      try {
        const response = await axiosInstance.get(endpoints.unavailability);
        this.unavailabilities = response.data.map((item) => {
          if (item.date) {
            return { ...item, type: "Specific Date" };
          } else {
            return { ...item, type: "Day of Week" };
          }
        });
      } catch (error) {
        this.message = "Error fetching unavailabilities.";
        this.messageType = "error";
        console.error("Error fetching unavailabilities:", error);
      }
    },
    async addUnavailability() {
      if (
        !this.newUnavailability.date &&
        this.newUnavailability.day_of_week === null
      ) {
        this.message =
          "Please select either a specific date or a day of the week.";
        this.messageType = "error";
        return;
      }

      let payload = {};
      if (this.newUnavailability.date) {
        payload = {
          date: this.newUnavailability.date,
          is_recurring: this.newUnavailability.is_recurring,
        };
      } else {
        payload = {
          day_of_week: this.newUnavailability.day_of_week,
          is_recurring: this.newUnavailability.is_recurring,
        };
      }

      try {
        const response = await axiosInstance.post(
          endpoints.unavailability,
          payload
        );
        if (response.status === 201) {
          // Reset the form
          this.newUnavailability = {
            day_of_week: null,
            date: null,
            is_recurring: false,
          };
          this.message = "Unavailability added successfully.";
          this.messageType = "success";
          this.fetchUnavailabilities();
        }
      } catch (error) {
        this.message = "Error adding unavailability.";
        this.messageType = "error";
        console.error("Error adding unavailability:", error);
      }
    },
  },
  mounted() {
    this.fetchUnavailabilities();
  },
};
</script>
