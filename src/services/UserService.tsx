import axios from "axios";
import config from "../config";
import { UserPostsResponse } from "../components/Interface";
import Swal from "sweetalert2";

const userService = {
  getUsers: async (): Promise<void> => {
    try {
      const serverRes = await axios.get(config.getUsersEndpoint);
      return serverRes.data;
    } catch (err: any) {
      Swal.fire("There was an error getting users", "", "error");
    }
  },

  getUserPosts: async (userId: number, pageNumber: number, pageSize: number): Promise<UserPostsResponse | void> => {
    try {
      const serverRes = await axios.get(`${config.getUserPostsEndpoint}/${userId}`, {
        params: {
          pageNumber,
          pageSize
        }
      });
      return serverRes.data;
    } catch (err: any) {
      Swal.fire("There was an error getting user posts", "", "error");
    }
  },

  deletePost: async (postId: number): Promise<void> => {
    try {
      const serverRes = await axios.delete(`${config.getUserPostsEndpoint}/${postId}`);
      return serverRes.data;
    } catch (err: any) {
      Swal.fire("There was an error deleting the post", "", "error");
    }
  }
};

export default userService;
