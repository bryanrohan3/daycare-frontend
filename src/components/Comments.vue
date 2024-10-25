<template>
  <div>
    <p class="fs-12">Comments</p>
    <div v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="success">
        <p>{{ comment.text }}</p>
        <p>Posted by User: {{ comment.user }}</p>
        <p>On: {{ new Date(comment.date_time_created).toLocaleString() }}</p>
        <p>Post ID: {{ comment.post }}</p>
      </div>
    </div>
    <p v-else>No comments yet.</p>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "Comments",
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
    };
  },
  watch: {
    postId: {
      immediate: true,
      handler() {
        this.fetchComments();
      },
    },
  },
  methods: {
    async fetchComments() {
      try {
        const response = await axiosInstance.get(
          `${endpoints.comments}?post=${this.postId}`
        );
        this.comments = response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
  },
};
</script>
