import axios from "axios";
import config from "../config";

const userService = {
  getUsers: async (): Promise<void> => {
    try {
      const serverRes = await axios.get(config.getUsersEndpoint);
      return serverRes.data;
    } catch (err: any) {
      return err.response?.data;
    }
  },

  getUserPosts: async (userId: number): Promise<void> => {
    try {
      const serverRes = await axios.get(`${config.getUserPostsEndpoint}/${userId}`);
      return serverRes.data;
    } catch (err: any) {
      return err.response?.data;
    }
  },

  deletePost: async (postId: number): Promise<void> => {
    try {
      const serverRes = await axios.delete(`${config.getUserPostsEndpoint}/${postId}`);
      return serverRes.data;
    } catch (err: any) {
      return err.response?.data;
    }
  }
};

export default userService;
