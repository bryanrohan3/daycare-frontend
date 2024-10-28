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
      liked: this.initialLiked,
    };
  },
  mounted() {
    this.fetchLikeStatus();
  },
  methods: {
    async fetchLikeStatus() {
      try {
        const response = await axiosInstance.get(`${endpoints.like}`, {
          params: { post: this.postId },
        });
        if (response.data) {
          this.liked = response.data.liked;
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    },
    async toggleLike() {
      try {
        if (this.liked) {
          await axiosInstance.delete(endpoints.like, {
            data: { post: this.postId },
          });
          this.liked = false;
        } else {
          await axiosInstance.post(endpoints.like, { post: this.postId });
          this.liked = true;
        }
        this.$emit("update-like", {
          liked: this.liked,
        });
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
  },
};
</script>
