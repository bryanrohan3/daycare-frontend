<template>
  <div class="mt-20">
    <h1 class="h-1">{{ isEditMode ? "" : "Create Daycare" }}</h1>
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
            <!-- Render multi-select field correctly -->
            <template v-if="field.type === 'multi-select'">
              <select
                :id="field.id"
                v-model="form[field.model]"
                :required="field.required"
                multiple
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                  :class="{
                    'selected-option': isSelected(
                      option.value,
                      form[field.model]
                    ),
                  }"
                >
                  {{ option.text }}
                </option>
              </select>
            </template>

            <template v-else-if="field.type === 'select'">
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
  props: {
    isEditMode: Boolean,
    selectedDaycareId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      createDaycareFields: createDaycareFields,
      form: this.initializeForm(createDaycareFields),
      currentUser: null,
      userDaycares: [], // Must be reactive
    };
  },
  async created() {
    try {
      this.currentUser = await fetchCurrentStaffProfile();
      this.userDaycares = await this.fetchUserDaycares();
      if (this.userDaycares.length > 0) {
        if (this.selectedDaycareId) {
          await this.fetchDaycareData(); // Fetch data for the selected daycare
        } else {
          this.selectedDaycareId = this.userDaycares[0].id; // Set default selection
        }
      }
    } catch (error) {
      console.error(
        "Error initializing staff profile or fetching daycares:",
        error
      );
    }
  },
  watch: {
    selectedDaycareId: "fetchDaycareData",
  },
  methods: {
    initializeForm(fields) {
      const form = {};

      fields.forEach((field) => {
        if (field.type === "array" && field.model === "opening_hours") {
          // Initialize opening hours for all 7 days
          form[field.model] = Array.from({ length: 7 }, (_, index) => ({
            day: index + 1, // Day from 1 to 7
            day_name: "", // Leave as blank, update from options if needed
            from_hour: "",
            to_hour: "",
            closed: false,
          }));
        } else if (field.type === "multi-select") {
          form[field.model] = []; // Initialize as an empty array for multi-select
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
    handleClosedChange(index) {
      // When the closed checkbox is checked, clear the time fields
      this.form.opening_hours[index].from_hour = "";
      this.form.opening_hours[index].to_hour = "";
    },
    populateForm(daycareData) {
      this.form.daycare_name = daycareData.daycare_name;
      this.form.street_address = daycareData.street_address;
      this.form.suburb = daycareData.suburb;
      this.form.state = daycareData.state;
      this.form.postcode = daycareData.postcode;
      this.form.phone = daycareData.phone;
      this.form.email = daycareData.email;
      this.form.capacity = daycareData.capacity;

      const allDays = Array.from({ length: 7 }, (_, i) => i + 1); // Days from 1 to 7
      this.form.opening_hours = allDays.map((day) => {
        const found = daycareData.opening_hours.find(
          (item) => item.day === day
        );
        return {
          day: day,
          day_name: found ? found.day_name : "", // Add default day name if needed
          from_hour: found && !found.closed ? found.from_hour : "",
          to_hour: found && !found.closed ? found.to_hour : "",
          closed: found ? found.closed : true,
        };
      });

      // Populate pet types
      this.form.pet_types = daycareData.pet_types;
    },
    isSelected(optionValue, selectedValues) {
      return selectedValues.includes(optionValue);
    },
    async submitForm() {
      try {
        const formattedOpeningHours = this.form.opening_hours.map((item) => {
          if (
            this.formatTime(item.from_hour) === "00:00:00" &&
            this.formatTime(item.to_hour) === "00:00:00"
          ) {
            return {
              ...item,
              from_hour: null,
              to_hour: null,
              closed: true,
            };
          }
          return {
            ...item,
            from_hour: this.formatTime(item.from_hour),
            to_hour: this.formatTime(item.to_hour),
            closed: false,
          };
        });

        const formData = {
          ...this.form,
          opening_hours: formattedOpeningHours,
          pet_types: this.form.pet_types, // Ensure pet_types are included
          createdBy: this.currentUser.id,
        };

        let response;
        if (this.isEditMode && this.selectedDaycareId) {
          response = await axiosInstance.put(
            `daycare/${this.selectedDaycareId}/`,
            formData
          );
        } else {
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
