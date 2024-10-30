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
    initialLikeCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      liked: this.initialLiked,
      likeCount: this.initialLikeCount,
      likeId: null,
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
            const response = await axiosInstance.delete(
              `${endpoints.like}${this.likeId}`
            );
          } else {
            console.warn("likeId is undefined, can't unlike");
          }
          this.liked = false;
          this.likeCount--;
        } else {
          const response = await axiosInstance.post(
            `${endpoints.like}?post=${this.postId}`
          );
          this.liked = true;
          this.likeCount++;
          this.likeId = response.data.id;
        }

        this.$emit("update-like", {
          postId: this.postId,
          liked: this.liked,
          likeCount: this.likeCount,
          likeId: this.liked ? this.likeId : null,
        });
      } catch (error) {
        console.error("Error toggling like:", error.response.data);
      }
    },
  },
};
</script>
