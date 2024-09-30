<template>
  <div>
    <h2>Add New Pet</h2>
    <form @submit.prevent="submitForm">
      <div v-for="field in petFormFields" :key="field.id" class="form-group">
        <label class="mt-10" :for="field.id">{{ field.label }}</label>
        <component
          :is="
            field.type === 'select'
              ? 'select'
              : field.type === 'textarea'
              ? 'textarea'
              : 'input'
          "
          :type="field.type"
          :id="field.id"
          v-model="formData[field.model]"
          :required="field.required"
        >
          <option v-if="field.type === 'select'" value="" disabled>
            Select an option
          </option>
          <option
            v-if="field.type === 'select'"
            v-for="option in field.options"
            :key="option.id"
            :value="option.id"
          >
            {{ option.label }}
          </option>
        </component>
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
      formData: {
        pet_name: "",

        pet_bio: "",
        is_public: true,
        is_active: true,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
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
    },
  },
};
</script>
