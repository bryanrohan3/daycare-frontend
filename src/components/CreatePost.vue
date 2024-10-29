<template>
  <div>
    <p class="h-2 bold">Create a New Post</p>
    <form @submit.prevent="createPost">
      <div class="form-group">
        <label for="daycare">Daycare ID:</label>
        <input type="number" v-model="daycare" required />
      </div>

      <div class="form-group">
        <label class="mt-10" for="caption">Caption:</label>
        <input type="text" v-model="caption" required />
      </div>

      <div class="form-group">
        <label class="mt-10" for="taggedPets"
          >Tagged Pets (IDs, comma-separated):</label
        >
        <input type="text" v-model="taggedPets" placeholder="Optional" />
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

export default {
  name: "CreatePost",
  data() {
    return {
      daycare: "",
      caption: "",
      taggedPets: "",
    };
  },
  methods: {
    async createPost() {
      try {
        const daycareId = parseInt(this.daycare, 10);
        if (!daycareId) {
          throw new Error("Daycare ID is required.");
        }

        const data = {
          daycare: daycareId, // Ensure daycare is a valid integer ID
          caption: this.caption,
          tagged_pets: this.taggedPets
            ? this.taggedPets.split(",").map(Number)
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
