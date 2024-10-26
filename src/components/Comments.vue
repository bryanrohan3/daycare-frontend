<template>
  <div>
    <button class="button button--tertiary" @click="openModal">
      View Comments
    </button>
    <Modal
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
    >
      <template v-slot:default>
        <div>
          <h3>Comments for Post {{ postId }}</h3>
          <div v-if="comments.length > 0">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-10 mb-10"
            >
              <p>{{ comment.text }}</p>
              <p>Posted by User: {{ comment.user }}</p>
              <p>
                On: {{ new Date(comment.date_time_created).toLocaleString() }}
              </p>
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
    openModal() {
      this.isModalVisible = true;
    },
  },
};
</script>
