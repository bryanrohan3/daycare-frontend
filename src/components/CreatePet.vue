<template>
  <div>
    <p class="h-2 bold">Add New Pet</p>
    <form @submit.prevent="submitForm">
      <div v-for="field in petFormFields" :key="field.id" class="form-group">
        <label class="mt-10" :for="field.id">{{ field.label }}</label>

        <select
          v-if="field.type === 'select'"
          :id="field.id"
          v-model="selectedPetType"
          @change="updatePetTypes"
          :required="field.required"
        >
          <option value="" disabled>Select an option</option>
          <option
            v-for="option in field.options"
            :key="option.id"
            :value="option.id"
          >
            {{ option.label }}
          </option>
        </select>

        <input
          v-else-if="field.type === 'text'"
          type="text"
          :id="field.id"
          v-model="formData[field.model]"
          :required="field.required"
        />

        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.id"
          v-model="formData[field.model]"
          :required="field.required"
        ></textarea>

        <!-- Checkbox Handling -->
        <input
          v-else-if="field.type === 'checkbox'"
          type="checkbox"
          :id="field.id"
          v-model="formData[field.model]"
          :true-value="true"
          :false-value="false"
        />
      </div>
      <button type="submit" class="button button--tertiary mt-10">
        Add Pet
      </button>
    </form>
  </div>
</template>

<script>
import { petFormFields } from "@/config/formFieldConfig";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CreatePet",
  data() {
    return {
      petFormFields: petFormFields,
      selectedPetType: null,
      formData: {
        pet_name: "",
        pet_types: [],
        pet_bio: "",
        is_public: true,
        is_active: true,
      },
    };
  },
  methods: {
    updatePetTypes() {
      this.formData.pet_types = this.selectedPetType
        ? [this.selectedPetType]
        : [];
    },
    async submitForm() {
      try {
        console.log("Submitting form data:", this.formData);
        await axiosInstance.post(endpoints.createPet, this.formData);
        this.$emit("petAdded");
        this.resetForm();
      } catch (error) {
        console.error("Error creating pet:", error);
        alert("Failed to add pet.");
      }
    },
    resetForm() {
      this.formData = {
        pet_name: "",
        pet_types: [],
        pet_bio: "",
        is_public: true,
        is_active: true,
      };
      this.selectedPetType = null;
    },
  },
};
</script>
