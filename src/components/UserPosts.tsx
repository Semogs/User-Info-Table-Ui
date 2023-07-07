import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import userService from "../services/UserService";
import { Post } from "./Interface";
import { PAGE_SIZE } from "../config";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "../css/userPosts.css";
import ContentLoader from "./ContentLoader";
import { handleNextPage, handlePrevPage } from "../utils";

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const { userId } = useParams<{ userId: string }>();

  const isInitialFetch = useRef(true);

  const fetchPosts = useCallback(async (): Promise<void> => {
    setLoading(true);
    if (userId) {
      const parsedUserId = parseInt(userId);
      const res = await userService.getUserPosts(parsedUserId, currentPage, PAGE_SIZE);
      setLoading(false);
      if (res && Array.isArray(res.posts)) {
        isInitialFetch.current = true;
        setPosts(res.posts);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        if (res.total <= 4) {
          setCurrentPage(1);
        }
      }
    }
  }, [userId, currentPage]);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      fetchPosts();
    }
  }, [fetchPosts]);

  const handleDeletePost = async (postId: number): Promise<void> => {
    await userService.deletePost(postId);
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    if (filteredPosts.length === 1) {
      fetchPosts();
    }

    if (filteredPosts.length === 1 && currentPage > 1) {
      const newTotalPages = Math.max(totalPages - 1, 1);
      setCurrentPage((prevPage) => Math.min(prevPage, newTotalPages));
      setTotalPages(newTotalPages);
    }
  };

  const filteredPosts = posts.filter((post) => post.title.includes(filter));

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value);

  return (
    <div className="page-con-user-posts">
      {loading ? (
        <ContentLoader />
      ) : (
        <div className="user-posts">
          <div className="user-posts-top-con">
            <TextField className="user-posts-filter" placeholder="Filter posts" value={filter} onChange={handleFilterChange} />
            <Button className="user-posts-back-button" component={Link} to="/" variant="contained">
              Back to Users
            </Button>
          </div>
          <div className="user-posts-wrapper">
            {!filteredPosts.length && <h2 className="user-posts-no-posts">There were no posts found</h2>}
            {filteredPosts.map((post) => (
              <article key={post.id} className="user-posts-post">
                <IconButton onClick={() => handleDeletePost(post.id)} className="user-post-delete-btn">
                  <DeleteIcon />
                </IconButton>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </article>
            ))}
          </div>
          <div className="user-posts-btn-con">
            <IconButton
              className="user-posts-button user-posts-button-prev"
              onClick={() => handlePrevPage(setCurrentPage, currentPage)}
              disabled={currentPage === 1}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              className="user-posts-button user-posts-button-next"
              onClick={() => handleNextPage(setCurrentPage, currentPage)}
              disabled={currentPage >= totalPages}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
