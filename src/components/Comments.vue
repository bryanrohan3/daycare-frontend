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
              v-for="(comment, index) in comments"
              :key="comment.id"
              class="p-10 mb-10"
            >
              <div class="flex-row-space">
                <p class="fs-12 bold">{{ comment.user.username }}</p>
                <p>
                  {{ new Date(comment.date_time_created).toLocaleString() }}
                </p>

                <button
                  v-if="
                    comment.user.id === currentUserId ||
                    currentUserId === postOwnerId
                  "
                  @click="toggleOptions(index)"
                  class="button button--tertiary"
                >
                  ...
                </button>

                <!-- Options menu -->
                <div v-if="comment.showOptions" class="options-menu">
                  <button
                    @click="startEditingComment(comment)"
                    class="option-item pointer"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteComment(comment.id)"
                    class="option-item pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- Display comment text or input if editing -->
              <p v-if="!comment.isEditing" class="mx-auto mb-20">
                {{ comment.text }}
              </p>
              <div v-else class="flex align-center gap-10">
                <input
                  v-model="comment.editText"
                  type="text"
                  class="comment-input p-10"
                />
                <button
                  @click="updateComment(comment)"
                  class="button button--tertiary"
                >
                  Save
                </button>
              </div>
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
    currentUserId: {
      type: Number,
      required: true,
    },
    postOwnerId: {
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
        this.comments = response.data.map((comment) => ({
          ...comment,
          showOptions: false,
          isEditing: false,
          editText: comment.text,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    openModal() {
      this.fetchComments();
      this.isModalVisible = true;
    },
    toggleOptions(index) {
      this.comments[index].showOptions = !this.comments[index].showOptions;
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
    startEditingComment(comment) {
      comment.isEditing = true;
      comment.showOptions = false;
    },
    async updateComment(comment) {
      if (!comment.editText.trim()) return;
      try {
        await axiosInstance.patch(`${endpoints.comments}${comment.id}/`, {
          text: comment.editText,
        });
        comment.text = comment.editText;
        comment.isEditing = false;
      } catch (error) {
        console.error("Error updating comment:", error);
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

.options-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.option-item {
  display: block;
  padding: 5px 10px;
  background-color: transparent;
  border: none;
}

.option-item:hover {
  background-color: #f0f0f0;
}
</style>
