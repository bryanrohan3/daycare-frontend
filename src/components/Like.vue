<template>
  <div>
    <button @click="toggleLike" class="button button--tertiary">
      <span v-if="liked">Unlike</span>
      <span v-else>Like</span>
    </button>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "Like",
  props: {
    postId: {
      type: Number,
      required: true,
    },
    initialLiked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      liked: this.initialLiked, // Set initial liked status from props
    };
  },
  methods: {
    async toggleLike() {
      console.log("Current liked status:", this.liked);
      try {
        if (this.liked) {
          console.log("Unliking post:", this.postId);
          const response = await axiosInstance.delete(
            `${endpoints.like}?post=${this.postId}`
            // this is wrong -> need to be api/like/3/ 3 = likeId
          );
          console.log("Unliked response:", response);
          this.liked = false; // Update local state to reflect unliking
        } else {
          console.log("Liking post:", this.postId);
          const response = await axiosInstance.post(
            `${endpoints.like}?post=${this.postId}`
          );
          console.log("Liked response:", response);
          this.liked = true; // Update local state to reflect liking
        }
        console.log("Updated liked status:", this.liked);

        // Emit an event to notify the parent component about the change
        this.$emit("update-like", {
          postId: this.postId,
          liked: this.liked,
        });
      } catch (error) {
        console.error("Error toggling like:", error.response.data); // Log error response data for better debugging
      }
    },
  },
};
</script>
