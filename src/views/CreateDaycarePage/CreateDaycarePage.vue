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
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import { createDaycareFields } from "@/config/formFieldConfig";

export default {
  name: "CreateDaycarePage",
  data() {
    return {
      createDaycareFields: createDaycareFields,
      form: this.initializeForm(createDaycareFields),
    };
  },
  methods: {
    initializeForm(fields) {
      const form = {};

      fields.forEach((field) => {
        if (field.type === "array" && field.model === "opening_hours") {
          // Find the options array for the 'day' field
          const dayOptions =
            field.fields.find((f) => f.type === "select")?.options || [];

          // Initialize form with days' names
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
    getComponentType(type) {
      switch (type) {
        case "text":
        case "number":
        case "email":
        case "time":
          return "input";
        case "select":
          return "select";
        case "checkbox":
          return "input";
        default:
          return "input";
      }
    },
    submitForm() {
      try {
        console.log("Daycare data:", this.form);

        // Example API call
        // await axios.post('/api/daycares', this.form);

        alert("Daycare created successfully!");
      } catch (error) {
        console.error("Error creating daycare:", error);
        alert("Failed to create daycare. Please try again.");
      }
    },
  },
};
</script>
