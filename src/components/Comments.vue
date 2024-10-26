<template>
  <div>
    <p class="fs-12 pointer" @click="openModal">View Comments</p>
    <Modal
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
    >
      <template v-slot:default>
        <div>
          <p class="h-2">Comments for Post {{ postId }}</p>

          <div class="align-center flex gap-10 mb-20">
            <input
              v-model="commentText"
              type="text"
              placeholder="Add a comment..."
              class="comment-input p-10"
            />
            <button @click="addComment" class="button button--tertiary">
              Send
            </button>
          </div>

          <!-- Display Comments -->
          <div v-if="comments.length > 0">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-10 mb-10"
            >
              <div class="flex-row-space">
                <p class="fs-12 bold">{{ comment.user.username }}</p>
                <p>
                  {{ new Date(comment.date_time_created).toLocaleString() }}
                </p>
                <!-- Delete button -->
                <button
                  class="button button--tertiary"
                  @click="deleteComment(comment.id)"
                >
                  Delete
                </button>
              </div>
              <p class="mx-auto mb-20">{{ comment.text }}</p>
            </div>
          </div>
          <p v-else>No comments yet.</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "Comments",
  components: {
    Modal,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      isModalVisible: false,
      commentText: "",
    };
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
    openModal() {
      this.fetchComments();
      this.isModalVisible = true;
    },
    async addComment() {
      if (!this.commentText.trim()) {
        return;
      }

      try {
        await axiosInstance.post(`${endpoints.comments}`, {
          post: this.postId,
          text: this.commentText,
        });
        this.commentText = "";
        this.fetchComments();
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
    async deleteComment(commentId) {
      try {
        await axiosInstance.patch(
          `${endpoints.comments}/${commentId}/soft_delete/`
        );
        this.fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
  },
};
</script>

<style scoped>
.comment-input {
  flex-grow: 1;
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0px;
}
</style>
