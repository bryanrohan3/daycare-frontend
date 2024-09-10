<template>
  <div>
    <div class="flex-row-space">
      <p class="h-1">{{ isEditMode ? "Edit Daycare" : "Create Daycare" }}</p>
      <!-- Dropdown for selecting a daycare to edit -->
      <div v-if="isEditMode" class="form-group">
        <label for="daycare-select">Select Daycare:</label>
        <select
          id="daycare-select"
          class="dropdown-edit-mode"
          v-model="selectedDaycareId"
          @change="fetchDaycareData"
        >
          <option
            v-for="daycare in userDaycares"
            :key="daycare.id"
            :value="daycare.id"
          >
            {{ daycare.daycare_name }}
          </option>
        </select>
      </div>
    </div>

    <form @submit.prevent="submitForm">
      <!-- Render All Fields Including Opening Hours -->
      <div
        v-for="(field, index) in createDaycareFields"
        :key="field.id"
        class="form-row mb-10"
      >
        <div class="form-group">
          <label :for="field.id">{{ field.label }}</label>

          <!-- Render Fields Based on Type -->
          <template
            v-if="field.type === 'array' && field.model === 'opening_hours'"
          >
            <div
              v-for="(item, itemIndex) in form[field.model]"
              :key="itemIndex"
              class="form-row mb-10"
            >
              <div
                v-for="subField in field.fields"
                :key="subField.id"
                class="form-group"
              >
                <label :for="`${subField.id}-${itemIndex}`">{{
                  subField.label
                }}</label>

                <template v-if="subField.type === 'select'">
                  <select
                    :id="`${subField.id}-${itemIndex}`"
                    v-model="item[subField.model]"
                    :required="subField.required"
                  >
                    <option
                      v-for="option in subField.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </template>

                <template v-else-if="subField.type === 'time'">
                  <input
                    type="time"
                    :id="`${subField.id}-${itemIndex}`"
                    v-model="item[subField.model]"
                    :required="subField.required"
                  />
                </template>

                <template v-else-if="subField.type === 'checkbox'">
                  <input
                    type="checkbox"
                    :id="`${subField.id}-${itemIndex}`"
                    v-model="item[subField.model]"
                    :required="subField.required"
                  />
                </template>
              </div>
            </div>
          </template>

          <template v-else>
            <template v-if="field.type === 'select'">
              <select
                :id="field.id"
                v-model="form[field.model]"
                :required="field.required"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </template>

            <template v-else-if="field.type === 'time'">
              <input
                type="time"
                :id="field.id"
                v-model="form[field.model]"
                :required="field.required"
              />
            </template>

            <template v-else-if="field.type === 'checkbox'">
              <input
                type="checkbox"
                :id="field.id"
                v-model="form[field.model]"
                :required="field.required"
              />
            </template>

            <template v-else>
              <input
                :type="field.type"
                :id="field.id"
                v-model="form[field.model]"
                :placeholder="field.placeholder ? field.placeholder : ''"
                :required="field.required"
              />
            </template>
          </template>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="button button--tertiary">
        {{ isEditMode ? "Save" : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script>
import { createDaycareFields } from "@/config/formFieldConfig";
import { fetchCurrentStaffProfile } from "@/helpers/fetchCurrentStaffProfile";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CreateDaycarePage",
  data() {
    return {
      createDaycareFields: createDaycareFields,
      form: this.initializeForm(createDaycareFields),
      currentUser: null,
      userDaycares: [], // Must be reactive
      selectedDaycareId: null,
      isEditMode: false,
    };
  },
  async created() {
    try {
      this.currentUser = await fetchCurrentStaffProfile();
      this.userDaycares = await this.fetchUserDaycares();
      if (this.userDaycares.length > 0) {
        this.selectedDaycareId = this.userDaycares[0].id; // Set the first daycare as default
        this.isEditMode = this.$route.name === "EditDaycarePage";
        if (this.isEditMode) {
          await this.fetchDaycareData(); // Fetch data for the default or selected daycare
        }
      }
    } catch (error) {
      console.error(
        "Error initializing staff profile or fetching daycares:",
        error
      );
    }
  },
  methods: {
    initializeForm(fields) {
      const form = {};

      fields.forEach((field) => {
        if (field.type === "array" && field.model === "opening_hours") {
          const dayOptions =
            field.fields.find((f) => f.type === "select")?.options || [];

          form[field.model] = dayOptions.map((option) => ({
            day: option.value,
            day_name: option.text,
            from_hour: "",
            to_hour: "",
            closed: false,
          }));
        } else {
          form[field.model] = "";
        }
      });

      return form;
    },
    async fetchUserDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        return response.data.daycares_names; // Ensure this line matches your API response structure
      } catch (error) {
        console.error("Error fetching user daycares:", error);
        return [];
      }
    },
    async fetchDaycareData() {
      if (!this.selectedDaycareId) return;

      try {
        const response = await axiosInstance.get(
          `daycare/${this.selectedDaycareId}/`
        );
        const daycareData = response.data;
        this.populateForm(daycareData);
      } catch (error) {
        console.error("Error fetching daycare data:", error);
      }
    },
    // try make this more modular becasue there isn't much point of having createDaycareFields for moudalrity
    populateForm(daycareData) {
      this.form.daycare_name = daycareData.daycare_name;
      this.form.street_address = daycareData.street_address;
      this.form.suburb = daycareData.suburb;
      this.form.state = daycareData.state;
      this.form.postcode = daycareData.postcode;
      this.form.phone = daycareData.phone;
      this.form.email = daycareData.email;
      this.form.capacity = daycareData.capacity;
      this.form.opening_hours = daycareData.opening_hours.map((item) => ({
        day: item.day,
        day_name: item.day_name,
        from_hour: item.from_hour || "",
        to_hour: item.to_hour || "",
        closed: item.closed,
      }));
    },
    async submitForm() {
      try {
        const formattedOpeningHours = this.form.opening_hours.map((item) => ({
          ...item,
          from_hour: this.formatTime(item.from_hour),
          to_hour: this.formatTime(item.to_hour),
        }));

        const formData = {
          ...this.form,
          opening_hours: formattedOpeningHours,
          createdBy: this.currentUser.id,
        };

        let response;
        if (this.isEditMode && this.selectedDaycareId) {
          // Update existing daycare
          response = await axiosInstance.put(
            `daycare/${this.selectedDaycareId}/`,
            formData
          );
        } else {
          // Create new daycare
          response = await axiosInstance.post(
            endpoints.createDaycare,
            formData
          );
        }

        console.log(
          this.isEditMode
            ? "Daycare updated successfully."
            : "Daycare created successfully."
        );
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    formatTime(time) {
      return time ? time : "00:00:00";
    },
  },
};
</script>
