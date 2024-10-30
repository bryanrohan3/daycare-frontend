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
    initialLikeId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      liked: this.initialLiked,
      likeId: this.initialLikeId,
    };
  },
  watch: {
    initialLiked(newVal) {
      this.liked = newVal;
    },
  },
  methods: {
    async toggleLike() {
      try {
        if (this.liked) {
          if (this.likeId) {
            await axiosInstance.delete(`${endpoints.like}${this.likeId}/`);
            this.liked = false;
            this.likeId = null;
          } else {
            console.warn("Cannot unlike as likeId is missing");
          }
        } else {
          const response = await axiosInstance.post(
            `${endpoints.like}?post=${this.postId}`
          );
          this.liked = true;
          this.likeId = response.data.id;
        }

        // Emit the like status
        this.$emit("update-like", {
          postId: this.postId,
          liked: this.liked,
          likeId: this.likeId,
        });
      } catch (error) {
        console.error(
          "Error toggling like:",
          error.response?.data || error.message
        );
      }
    },
  },
};
</script>
