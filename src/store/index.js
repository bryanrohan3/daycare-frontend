import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    authToken: null,
    userProfile: null,
    userAccountType: null, // Add this line
  },
  getters: {
    getAuthToken(state) {
      return state.authToken;
    },
    getUserProfile(state) {
      return state.userProfile;
    },
    getUserAccountType(state) {
      return state.userAccountType;
    },
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
    },
    setUserProfile(state, user) {
      state.userProfile = user;
    },
    setUserAccountType(state, account_type) {
      state.userAccountType = account_type; // Make sure this line is present
    },
    logout(state) {
      state.authToken = null;
      state.userProfile = null;
      state.userAccountType = null; // Clear the role on logout
    },
  },

  actions: {},
  plugins: [createPersistedState()],
});
