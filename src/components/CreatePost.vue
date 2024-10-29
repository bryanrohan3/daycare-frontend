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

      <div class="form-group">
        <label class="mt-10" for="taggedPets">Search for Tagged Pets:</label>
        <input
          type="text"
          v-model="searchQuery"
          @input="debouncedSearchPets"
          placeholder="Search pets..."
        />
        <ul v-if="searchResults.length > 0" class="search-results">
          <li
            v-for="pet in searchResults"
            :key="pet.id"
            @click="togglePetSelection(pet.id)"
            :class="{ selected: selectedPetIds.includes(pet.id) }"
          >
            {{ pet.pet_name }}
          </li>
        </ul>
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
import debounce from "lodash.debounce";

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
      searchQuery: "",
      searchResults: [],
      selectedPetIds: [],
      debouncedSearchPets: null,
    };
  },
  created() {
    this.fetchDaycares();
    this.debouncedSearchPets = debounce(this.searchPets, 300);
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
    async searchPets() {
      if (!this.searchQuery) {
        this.searchResults = [];
        return;
      }
      try {
        const response = await axiosInstance.get(
          `${endpoints.pets}?pet_name=${this.searchQuery}`
        );
        this.searchResults = response.data;
      } catch (error) {
        console.error("Error searching pets:", error);
      }
    },
    togglePetSelection(petId) {
      const index = this.selectedPetIds.indexOf(petId);
      if (index > -1) {
        // Pet is already selected, remove it
        this.selectedPetIds.splice(index, 1);
      } else {
        // Pet is not selected, add it
        this.selectedPetIds.push(petId);
      }
      this.formData.taggedPets = this.selectedPetIds.join(",");
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
          tagged_pets: this.selectedPetIds,
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
