<template>
  <div>
    <p class="h-2 bold">Create a New Post</p>
    <form @submit.prevent="createPost">
      <div class="form-group" v-for="field in createPostFields" :key="field.id">
        <label class="mt-10" :for="field.id">{{ field.label }}:</label>
        <input
          v-if="field.model !== 'daycare'"
          :type="field.type"
          v-model="formData[field.model]"
          :required="field.required"
          :placeholder="field.placeholder || ''"
        />

        <select
          v-if="field.model === 'daycare'"
          v-model="formData.daycare"
          :required="field.required"
        >
          <option value="" disabled>Select a daycare</option>
          <option
            v-for="daycare in daycares"
            :key="daycare.id"
            :value="daycare.id"
          >
            {{ daycare.daycare_name }}
          </option>
        </select>
      </div>

      <div class="flex-row-space">
        <button type="submit" class="button button--tertiary mt-10">
          Post
        </button>
        <button
          type="button"
          class="button button--tertiary mt-10"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { createPostFields } from "@/config/formFieldConfig";

export default {
  name: "CreatePost",
  data() {
    return {
      formData: {
        daycare: "",
        caption: "",
        taggedPets: "",
      },
      createPostFields,
      daycares: [],
    };
  },
  created() {
    this.fetchDaycares();
  },
  methods: {
    async fetchDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        this.daycares = response.data.daycares_names;
      } catch (error) {
        console.error("Error fetching daycares:", error);
      }
    },
    async createPost() {
      try {
        const daycareId = parseInt(this.formData.daycare, 10);
        if (!daycareId) {
          throw new Error("Daycare ID is required.");
        }

        const data = {
          daycare: daycareId,
          caption: this.formData.caption,
          tagged_pets: this.formData.taggedPets
            ? this.formData.taggedPets.split(",").map(Number)
            : [],
        };

        await axiosInstance.post(endpoints.posts, data);
        this.$emit("post-created");
        this.$emit("close");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },
  },
};
</script>
