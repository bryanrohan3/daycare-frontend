<template>
  <div>
    <p class="h-1">Create Daycare</p>

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
                <label :for="`${subField.id}-${itemIndex}`">
                  {{ subField.label }}
                </label>

                <template v-if="subField.type === 'select'">
                  <select
                    :id="`${subField.id}-${itemIndex}`"
                    v-model="item[subField.model]"
                    class="form-control"
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
                    class="form-control"
                    :required="subField.required"
                  />
                </template>

                <template v-else-if="subField.type === 'checkbox'">
                  <input
                    type="checkbox"
                    :id="`${subField.id}-${itemIndex}`"
                    v-model="item[subField.model]"
                    class="form-control"
                    :required="subField.required"
                  />
                </template>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Render Other Fields (e.g., text, number, email) -->
            <template v-if="field.type === 'select'">
              <select
                :id="field.id"
                v-model="form[field.model]"
                class="form-control"
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
                class="form-control"
                :required="field.required"
              />
            </template>

            <template v-else-if="field.type === 'checkbox'">
              <input
                type="checkbox"
                :id="field.id"
                v-model="form[field.model]"
                class="form-control"
                :required="field.required"
              />
            </template>

            <template v-else>
              <input
                :type="field.type"
                :id="field.id"
                v-model="form[field.model]"
                :placeholder="field.placeholder ? field.placeholder : ''"
                class="form-control"
                :required="field.required"
              />
            </template>
          </template>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="button button--tertiary">Submit</button>
    </form>
  </div>
</template>

<script>
import { createDaycareFields } from "@/config/formFieldConfig";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CreateDaycarePage",
  data() {
    return {
      createDaycareFields: createDaycareFields,
      form: this.initializeForm(createDaycareFields),
      currentUser: null,
    };
  },
  async created() {
    await this.fetchCurrentStaffProfile();
  },
  methods: {
    initializeForm(fields) {
      const form = {};

      fields.forEach((field) => {
        if (field.type === "array" && field.model === "opening_hours") {
          const dayOptions =
            field.fields.find((f) => f.type === "select")?.options || [];

          form[field.model] = dayOptions.map((option) => ({
            day: option.value, // Default value for 'day'
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
    formatTime(time) {
      if (!time) return ""; // Return empty if no time is provided
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}:00`; // Append seconds to the time
    },
    convertEmptyToNull(openingHours) {
      return openingHours.map((item) => {
        if (item.closed) {
          return {
            ...item,
            from_hour: null,
            to_hour: null,
          };
        }
        return {
          ...item,
          from_hour: item.from_hour.trim() === "" ? null : item.from_hour,
          to_hour: item.to_hour.trim() === "" ? null : item.to_hour,
        };
      });
    },
    async fetchCurrentStaffProfile() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        this.currentUser = response.data;
        console.log("Current Staff Profile:", this.currentUser);
      } catch (error) {
        console.error("Error fetching current staff profile:", error);
      }
    },
    async submitForm() {
      try {
        const updatedOpeningHours = this.convertEmptyToNull(
          this.form.opening_hours
        );

        const formattedOpeningHours = updatedOpeningHours.map((item) => ({
          ...item,
          from_hour: this.formatTime(item.from_hour),
          to_hour: this.formatTime(item.to_hour),
        }));

        const formData = {
          ...this.form,
          opening_hours: formattedOpeningHours,
          createdBy: this.currentUser.id,
        };

        console.log("Daycare data being submitted:", formData);

        const response = await axiosInstance.post(
          endpoints.createDaycare,
          formData
        );

        console.log("Daycare created successfully. Response:", response.data);

        alert("Daycare created successfully!");
      } catch (error) {
        console.error("Error creating daycare:", error);

        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          console.error("Error response data:", error.response.data);

          const errorMessage =
            error.response.data.detail ||
            "Failed to create daycare. Please try again.";
          alert(errorMessage);
        } else {
          console.error("Error message:", error.message);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    },
  },
};
</script>
